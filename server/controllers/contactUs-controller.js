import { addContactUsService } from "../services/conatctUS-service.js";

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
