import Availability from "../models/availability.model.js";

// Controller to add a new availability slot for a lawyer
export const addAvailability = async (req, res) => {
  const { startTime, endTime } = req.body; 
  const lawyerId = req.user._id; 

  try {
    // Validate that the start time is before the end time
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: "Start time must be before end time" });
    }

    // Validate that the start time is not in the past
    if (new Date(startTime) < Date.now()) {
      return res.status(400).json({ error: "Cannot set availability in the past" });
    }

    // Create a new availability slot and save it to the database
    const slot = new Availability({
      lawyerId,
      startTime,
      endTime,
      status: "available", 
      date: new Date(), 
    });
    await slot.save();

    // Respond with the created slot
    res.status(201).json({ success: true, data: slot });
  } catch (error) {
    console.error("Error in addAvailability:", error);
    res.status(500).json({ error: "Failed to add availability", message: error.message });
  }
};

// Controller to fetch all available slots for a specific lawyer
export const getAvailableSlots = async (req, res) => {
  const { lawyerId } = req.params; 

  try {
    // Find all slots with status "available" for the given lawyer, sorted by start time
    const slots = await Availability.find({ lawyerId, status: "available" }).sort({ startTime: 1 });

    // Respond with the available slots
    res.status(200).json({ success: true, data: slots });
  } catch (error) {
    console.error("Error in getAvailableSlots:", error);
    // Handle errors during slot retrieval
    res.status(500).json({ error: "Failed to fetch slots", message: error.message });
  }
};

// Controller to fetch all slots (both available and unavailable) for a specific lawyer
export const getAllSlots = async (req, res) => {
  const { lawyerId } = req.params; 

  try {
    // Find all slots for the given lawyer, sorted by start time
    const slots = await Availability.find({ lawyerId }).sort({ startTime: 1 });

    // Respond with all slots
    res.status(200).json({ success: true, data: slots });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch all slots", message: error.message });
  }
};

// Controller to remove an availability slot for a lawyer
export const removeAvailability = async (req, res) => {
  const { slotId } = req.params; 
  const lawyerId = req.user._id; 

  try {
    // Find the slot by ID and lawyer ID to ensure the lawyer owns the slot
    const slot = await Availability.findOne({ _id: slotId, lawyerId });
    if (!slot) {
      return res.status(404).json({ error: "Availability slot not found" });
    }

    // Check if the slot starts within the next 15 minutes
    const now = new Date();
    const startTime = new Date(slot.startTime);
    const timeDifference = (startTime - now) / (1000 * 60); 

    if (timeDifference <= 15) {
      return res.status(400).json({
        error: "Cannot remove slot less than 15 minutes before start time",
      });
    }

    // Delete the slot from the database
    await Availability.deleteOne({ _id: slotId });

    // Respond with a success message
    res.status(200).json({ success: true, message: "Availability slot removed successfully" });
  } catch (error) {
    console.error("Error in removeAvailability:", error);
    res.status(500).json({ error: "Failed to remove availability", message: error.message });
  }
};