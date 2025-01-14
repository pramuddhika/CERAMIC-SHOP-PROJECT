import {
  generateUseIdService,
  createMemberService,
} from "../services/auth-service.js";

// generate user ID
export const generateUserIdController = async (req, res) => {
  try {
    const userId = await generateUseIdService();
    res.status(200).json(userId);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// create member
export const createMemberController = async (req, res) => {
    const { userId, firstName, lastName, userType, email, status } = req.body;
    console.log('req.body',req.body)
  if (!userId || !firstName || !lastName || !userType || !email || !status) {
    return res.status(400).json({ error: "All data required!" });
  }
  try {
    const createMemberResponse = await createMemberService(userId,firstName,lastName,userType,email,status);
    res.status(200).json(createMemberResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
