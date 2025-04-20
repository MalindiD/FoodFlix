const Restaurant = require("../../models/restaurant/Restaurant");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "defaultsecret", {
    expiresIn: "7d"
  });
};

exports.registerRestaurant = async (req, res) => {
  console.log("🔥 Register hit");
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  try {
    const {
      name,
      email,
      password,
      contactNumber,
      address,
      cuisineType,
      openingHours,
      imageUrl
    } = req.body;

    const existing = await Restaurant.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Restaurant already exists" });

    // ✅ Fallback logic: file upload > URL > empty
    const finalImage = req.file?.path || imageUrl || "";

    const newRestaurant = new Restaurant({
      name,
      email,
      password,
      contactNumber,
      address,
      cuisineType,
      openingHours,
      profileImage: finalImage
    });

    await newRestaurant.save();

    res.status(201).json({
      message: "Registered successfully",
      token: generateToken(newRestaurant._id),
      restaurant: {
        id: newRestaurant._id,
        name: newRestaurant.name,
        email: newRestaurant.email,
        profileImage: newRestaurant.profileImage
      }
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

exports.loginRestaurant = async (req, res) => {
  try {
    const { email, password } = req.body;
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant || !(await restaurant.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      token: generateToken(restaurant._id),
      restaurant: {
        id: restaurant._id,
        name: restaurant.name,
        email: restaurant.email,
        profileImage: restaurant.profileImage
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
