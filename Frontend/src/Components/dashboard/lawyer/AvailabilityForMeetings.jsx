import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../../../Context/AuthContext";
import { AppContext } from "../../../Context/AppContext";
import { toast } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

const LawyerAvailability = ({ open, onClose }) => {
  const { user } = useAuthContext(); 
  const { backendUrl } = React.useContext(AppContext); 
  const [selectedDate, setSelectedDate] = useState(null); 
  const [startTime, setStartTime] = useState(""); 
  const [newSlots, setNewSlots] = useState([]); 
  const [existingSlots, setExistingSlots] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  // Fetch existing slots for the selected date when the date or user ID changes
  useEffect(() => {
    if (selectedDate && user?._id) {
      const fetchSlots = async () => {
        try {
          const response = await axios.get(
            `${backendUrl}/api/availability/all/${user._id}`,
            { withCredentials: true }
          );
          const slots = response.data.data
            .filter((slot) => dayjs(slot.startTime).isSame(selectedDate, "day")) // Filter slots for the selected date
            .map((slot) => ({
              _id: slot._id, 
              startTime: slot.startTime,
              endTime: slot.endTime, 
              status: slot.status, 
              displayStart: dayjs(slot.startTime).format("HH:mm"), 
              displayEnd: dayjs(slot.endTime).format("HH:mm"), 
            }));
          setExistingSlots(slots); // Update the state with fetched slots
        } catch (err) {
          console.error("Failed to fetch slots:", err);
          setError("Failed to load existing slots"); 
        }
      };
      fetchSlots();
    }
  }, [selectedDate, user?._id]);

  // Calculate the end time for a slot based on the start time
  const getEndTime = useCallback(
    (time) => {
      const start = dayjs(`${selectedDate.format("YYYY-MM-DD")} ${time}`);
      return start.add(30, "minute").format("HH:mm"); // Add 30 minutes to the start time
    },
    [selectedDate]
  );

  // Add a new availability slot
  const handleAddSlot = () => {
    if (!selectedDate || !startTime) {
      setError("Please select a date and start time"); // Validate inputs
      return;
    }

    const start = dayjs(`${selectedDate.format("YYYY-MM-DD")} ${startTime}`);
    if (start.isBefore(dayjs())) {
      setError("Cannot set availability in the past"); // Prevent adding slots in the past
      return;
    }

    const newSlotStart = start;
    const newSlotEnd = start.add(30, "minute"); 
    const allSlots = [...newSlots, ...existingSlots]; 
    const hasOverlap = allSlots.some((slot) => {
      const existingStart = dayjs(slot.startTime);
      const existingEnd = dayjs(slot.endTime);
      return newSlotStart.isBefore(existingEnd) && newSlotEnd.isAfter(existingStart); 
    });

    if (hasOverlap) {
      setError("This slot overlaps with an existing slot"); // Prevent overlapping slots
      return;
    }

    const newSlot = {
      date: selectedDate.format("YYYY-MM-DD"), 
      startTime: start.toISOString(), 
      endTime: newSlotEnd.toISOString(), 
      displayStart: start.format("HH:mm"), 
      displayEnd: newSlotEnd.format("HH:mm"),
      status: "available", 
    };

    setNewSlots((prev) =>
      [...prev, newSlot].sort((a, b) => dayjs(a.startTime).diff(dayjs(b.startTime))) 
    );
    setStartTime(""); // Reset start time input
    setError(null); 
  };

  // Remove a newly added slot
  const handleRemoveNewSlot = (index) => {
    setNewSlots((prev) => prev.filter((_, i) => i !== index)); // Remove the slot from the state
  };

  // Remove an existing slot from the backend
  const handleRemoveExistingSlot = async (slotId) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/availability/${slotId}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setExistingSlots((prev) => prev.filter((slot) => slot._id !== slotId)); // Remove the slot from the state
        toast.success("Slot removed successfully"); // Show success message
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to remove slot"; // Handle errors
      toast.error(errorMessage);
    }
  };

  // Submit new slots to the backend
  const handleSubmit = async () => {
    if (newSlots.length === 0) {
      setError("Please add at least one new availability slot"); // Validate that there are new slots
      return;
    }

    setLoading(true); // Show loading indicator
    setError(null); // Clear error messages

    try {
      const response = await Promise.all(
        newSlots.map((slot) =>
          axios.post(
            `${backendUrl}/api/availability/add`,
            {
              startTime: slot.startTime,
              endTime: slot.endTime,
            },
            { withCredentials: true }
          )
        )
      );

      if (response.every((res) => res.data.success)) {
        toast.success(
          `Successfully added ${newSlots.length} availability slot${newSlots.length > 1 ? "s" : ""}!`
        );
        const newSlotsWithIds = response.map((res, index) => ({
          ...newSlots[index],
          _id: res.data.data._id, // Add the slot ID from the backend response
        }));
        setExistingSlots((prev) =>
          [...prev, ...newSlotsWithIds].sort((a, b) =>
            dayjs(a.startTime).diff(dayjs(b.startTime))
          )
        );
        setNewSlots([]); // Clear new slots
        setStartTime(""); // Reset start time input
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to add availability slots"; // Handle errors
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  // Close the dialog and reset states
  const handleClose = () => {
    onClose();
    setNewSlots([]); 
    setStartTime(""); 
    setError(null); 
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Manage Your Availability</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)} 
              minDate={dayjs()} 
              sx={{ mt: 2 }}
            />
          </LocalizationProvider>

          <div className="flex gap-2 items-end mt-4">
            <TextField
              label="Start Time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)} // Update start time input
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 1800 }} // Step of 30 minutes
            />
            <Button
              variant="outlined"
              onClick={handleAddSlot} // Add a new slot
              disabled={!startTime || !selectedDate} // Disable button if inputs are invalid
            >
              Add Slot
            </Button>
          </div>

          {(existingSlots.length > 0 || newSlots.length > 0) && (
            <div className="mt-4">
              <Typography variant="subtitle1">Availability Slots:</Typography>
              <List dense>
                {[...existingSlots, ...newSlots]
                  .sort((a, b) => dayjs(a.startTime).diff(dayjs(b.startTime))) // Sort slots by start time
                  .map((slot, index) => {
                    const minutesUntilStart = dayjs(slot.startTime).diff(dayjs(), "minute");
                    const canRemove = minutesUntilStart > 15 && slot.status === "available"; // Prevent removing slots starting soon
                    const isNewSlot = !slot._id; // Check if the slot is newly added

                    return (
                      <ListItem
                        key={slot._id || `new-${index}`} // Use unique key for new slots
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() =>
                              isNewSlot
                                ? handleRemoveNewSlot(index - existingSlots.length) // Remove new slot
                                : handleRemoveExistingSlot(slot._id) // Remove existing slot
                            }
                            disabled={!canRemove} // Disable delete button if slot cannot be removed
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={`${slot.displayStart} - ${slot.displayEnd} (${slot.status})`} // Display slot details
                        />
                      </ListItem>
                    );
                  })}
              </List>
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>} {/* Display error messages */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Close
          </Button>
          <Button
            onClick={handleSubmit} // Submit new slots
            variant="contained"
            disabled={loading || newSlots.length === 0} // Disable button if no new slots
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              `Add ${newSlots.length} Slot${newSlots.length !== 1 ? "s" : ""}`
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LawyerAvailability;