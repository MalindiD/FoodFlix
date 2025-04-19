// utils/messageQueue.js
const amqp = require('amqplib');
const config = require('../config/db');

let channel = null;

// Connect to RabbitMQ and create a channel
const connectQueue = async () => {
  try {
    const connection = await amqp.connect(config.RABBITMQ_URL);
    channel = await connection.createChannel();
    
    // Declare queues
    await channel.assertQueue('restaurant_notifications', { durable: true });
    await channel.assertQueue('customer_notifications', { durable: true });
    await channel.assertQueue('delivery_assignments', { durable: true });
    
    console.log('Connected to RabbitMQ');
    return channel;
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    process.exit(1);
  }
};

// Publish message to queue
const publishToQueue = async (queue, message) => {
  try {
    if (!channel) await connectQueue();
    return channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
  } catch (error) {
    console.error(`Error publishing to queue ${queue}:`, error);
    throw error;
  }
};

// Consume messages from queue
const consumeFromQueue = async (queue, callback) => {
  try {
    if (!channel) await connectQueue();
    await channel.assertQueue(queue, { durable: true });
    channel.consume(queue, (message) => {
      if (message !== null) {
        const content = JSON.parse(message.content.toString());
        callback(content);
        channel.ack(message);
      }
    });
  } catch (error) {
    console.error(`Error consuming from queue ${queue}:`, error);
    throw error;
  }
};

module.exports = {
  connectQueue,
  publishToQueue,
  consumeFromQueue
};