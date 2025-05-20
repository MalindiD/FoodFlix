// utils/messageQueue.js
const amqp = require('amqplib');
const config = require('../config/db');

let channel = null;
let isConnected = false;

// Try to connect to RabbitMQ and create a channel
const connectQueue = async () => {
  try {
    const connection = await amqp.connect(config.RABBITMQ_URL);
    channel = await connection.createChannel();

    // Declare queues
    await channel.assertQueue('restaurant_notifications', { durable: true });
    await channel.assertQueue('customer_notifications', { durable: true });
    await channel.assertQueue('delivery_assignments', { durable: true });

    console.log('✅ Connected to RabbitMQ');
    isConnected = true;
    return channel;
  } catch (error) {
    console.warn('⚠️ RabbitMQ not available. Skipping message queue setup for now.');
    isConnected = false;
  }
};

// Safely publish to queue only if connected
const publishToQueue = async (queue, message) => {
  try {
    if (!channel && !isConnected) await connectQueue();
    if (!isConnected) return console.warn(`⚠️ Skipped publishing to ${queue}: MQ not connected`);
    return channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
  } catch (error) {
    console.error(`Error publishing to queue ${queue}:`, error.message);
  }
};

// Safely consume from queue only if connected
const consumeFromQueue = async (queue, callback) => {
  try {
    if (!channel && !isConnected) await connectQueue();
    if (!isConnected) return console.warn(`⚠️ Skipped consuming ${queue}: MQ not connected`);

    await channel.assertQueue(queue, { durable: true });
    channel.consume(queue, (message) => {
      if (message !== null) {
        const content = JSON.parse(message.content.toString());
        callback(content);
        channel.ack(message);
      }
    });
  } catch (error) {
    console.error(`Error consuming from queue ${queue}:`, error.message);
  }
};

module.exports = {
  connectQueue,
  publishToQueue,
  consumeFromQueue
};
