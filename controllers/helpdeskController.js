import Ticket from "../models/Ticket.js";

export const createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create({
      ...req.body
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("user", "name email");

    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    res.json(ticket);

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getAllTickets = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      priority = "",
    } = req.query;

    const query = {};

    // 🔥 SEARCH FIX
    if (search) {
      query.$or = [
        { topic: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // 🔥 STATUS FIX (case insensitive)
    if (status) {
      query.status = { $regex: `^${status}$`, $options: "i" };
    }

    // 🔥 PRIORITY FIX
    if (priority) {
      query.priority = { $regex: `^${priority}$`, $options: "i" };
    }

    const tickets = await Ticket.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Ticket.countDocuments(query);

    res.json({
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      total,
      tickets,
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const updateTicket = async (req, res) => {
  try {
    const { status, response } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    ticket.status = status || ticket.status;
    ticket.response = response || ticket.response;

    await ticket.save();

    res.json(ticket);

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};