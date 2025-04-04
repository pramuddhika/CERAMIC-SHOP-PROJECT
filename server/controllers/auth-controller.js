import bcrypt from "bcrypt";
import {
  generateUseIdService,
  createMemberService,
  signUpService,
  createSupplierService,
  getSupplierListService,
  loginService,
  getSupplierDataService,
  editSupplierService,
  getMemberDataService,
  editMemberService,
  getRegisterPageDataService,
  RegisterService,
  getCustomerDataService
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

// create customer - signup
export const signUpController = async (req, res) => {
  const { firstName, lastName, email, password,userId, userType , status } = req.body;
  if ( !firstName || !lastName || !email || !password || !userId || !userType) {
    return res.status(400).json({ error: "All data required!" });
  }
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const signUpResponse = await signUpService(userId,firstName,lastName,email,hashedPassword,userType , status);
    res.status(200).json(signUpResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//create supplier
export const supplierController = async (req, res) => {
  const { userId, firstName, lastName, email, status, phone, line1, line2, city, distric, province, postalCode } = req.body;
  try {
    const createSupplierResponse = await createSupplierService(userId,firstName,lastName,email,status,phone,line1,line2,city,distric,province,postalCode);
    res.status(200).json(createSupplierResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//get supplier list
export const supplierListController = async (req, res) => {
  try {
    const supplierList = await getSupplierListService();
    res.status(200).json(supplierList);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// login
export const loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email & password are required!" });
  }
  try {
    const loginResponse = await loginService(email, password);
    res.status(200).json(loginResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// get supplier data
export const supplierDataController = async (req, res) => {
  const { page, limit , search } = req.query;
  try {
    const supplierData = await getSupplierDataService( page, limit , search);
    res.status(200).json(supplierData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// edit supplier
export const supplierEditController = async (req, res) => {
  const { userId, firstName, lastName, email, status, phone, line1, line2, city, distric, province, postalCode } = req.body;
  try {
    const editSupplierResponse = await editSupplierService(userId,firstName,lastName,email,status,phone,line1,line2,city,distric,province,postalCode);
    res.status(200).json(editSupplierResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// get member data
export const getMemberDataController = async (req, res) => {
  const { page, limit , search } = req.query;
  try {
    const supplierData = await getMemberDataService( page, limit , search);
    res.status(200).json(supplierData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// edit member data
export const editMemberDataController = async (req, res) => {
  const { userId, firstName, lastName, email, status , userType } = req.body;
  try {
    const editMemberResponse = await editMemberService(userId,firstName,lastName,email,status, userType);
    res.status(200).json(editMemberResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// get register page data
export const getRegisterPageDataController = async (req, res) => {
  const { id } = req.params;
  try {
    const registerPageData = await getRegisterPageDataService(id);
    res.status(200).json(registerPageData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// register user
export const RegisterController = async (req, res) => {
  const { userId, password } = req.body;
  if (!userId || !password ) {
    return res.status(400).json({ error: "All data required!" });
  }
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const registerResponse = await RegisterService(userId,hashedPassword);
    res.status(200).json(registerResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// get customer data
export const getCustomerDataController = async (req, res) => {
  const { page, limit , search } = req.query;
  try {
    const customerData = await getCustomerDataService( page, limit , search);
    res.status(200).json(customerData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};