import axios from "axios";

const API = "http://localhost:5000/api/recipes";

export const generateRecipe = async (data) => {

  const response = await axios.post(
    `${API}/generate`,
    data
  );

  return response.data;

};