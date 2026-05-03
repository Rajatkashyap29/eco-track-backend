export const createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create({
      ...req.body,
      user: req.user._id,
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



export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(tickets);
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