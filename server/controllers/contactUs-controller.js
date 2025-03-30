import {
  addContactUsService,
  getContactUsService,
  sendConrtactUsReplyService,
} from "../services/conatctUS-service.js";

//add conatct us data to db
export const addContactUsController = async (req, res) => {
  const { fullName, email, message } = req.body;
  try {
    const contactUsResponse = await addContactUsService(
      fullName,
      email,
      message
    );
    res.status(200).json(contactUsResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//get contact us data from db
export const getContactUsController = async (req, res) => {
  const { page, limit } = req.query;
  try {
    const contactUsResponse = await getContactUsService(page, limit);
    res.status(200).json(contactUsResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//send reply to email
export const sendConrtactUsReplyController = async (req, res) => {
  const { id, email, reply } = req.body;
  try {
    const contactUsResponse = await sendConrtactUsReplyService(id, email, reply);
    res.status(200).json(contactUsResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
