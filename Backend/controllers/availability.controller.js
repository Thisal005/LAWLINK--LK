import Availability from "../models/availability.model.js";

export const addAvailability = async (req, res) => {
  const { startTime, endTime } = req.body;
  const lawyerId = req.user._id;

  try {
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: "Start time must be before end time" });
    }
    if (new Date(startTime) < Date.now()) {
      return res.status(400).json({ error: "Cannot set availability in the past" });
    }

    const slot = new Availability({ lawyerId, startTime, endTime, status: "available", date: new Date() });
    await slot.save();
    res.status(201).json({ success: true, data: slot });
  } catch (error) {
    console.error("Error in addAvailability:", error);
    res.status(500).json({ error: "Failed to add availability", message: error.message });
  }
};

export const getAvailableSlots = async (req, res) => {
  const { lawyerId } = req.params;

  try {
    const slots = await Availability.find({ lawyerId, status: "available" }).sort({ startTime: 1 });
    res.status(200).json({ success: true, data: slots });
  } catch (error) {
    console.error("Error in getAvailableSlots:", error);
    res.status(500).json({ error: "Failed to fetch slots", message: error.message });
  }
};

export const getAllSlots = async (req, res) => {
  const { lawyerId } = req.params;

  try {
    const slots = await Availability.find({ lawyerId }).sort({ startTime: 1 });
    res.status(200).json({ success: true, data: slots });
  } catch (error) {
    console.error("Error in getAllSlots:", error);
    res.status(500).json({ error: "Failed to fetch all slots", message: error.message });
  }
};

export const removeAvailability = async (req, res) => {
  const { slotId } = req.params;
  const lawyerId = req.user._id;

  try {
    const slot = await Availability.findOne({ _id: slotId, lawyerId });
    if (!slot) {
      return res.status(404).json({ error: "Availability slot not found" });
    }

    const now = new Date();
    const startTime = new Date(slot.startTime);
    const timeDifference = (startTime - now) / (1000 * 60); 

    if (timeDifference <= 15) {
      return res.status(400).json({
        error: "Cannot remove slot less than 15 minutes before start time",
      });
    }

    await Availability.deleteOne({ _id: slotId });
    res.status(200).json({ success: true, message: "Availability slot removed successfully" });
  } catch (error) {
    console.error("Error in removeAvailability:", error);
    res.status(500).json({ error: "Failed to remove availability", message: error.message });
  }
};