import axios from "axios";
import config from "../config/config";
import { PRODUCT } from "../constants/backend.constants";

type ListProductApi = {
  query?: Record<string, any>;
};

const listProducts = (args?: ListProductApi) => {
  let url = config.BACKEND_BASE + PRODUCT.LIST;

  let query = args || {};
  return axios.get(url, {
    params: query,
  })
    .then((response) => {
      // Generate URL with queries
      const generatedUrl = new URL(url); 
      Object.entries(query).forEach(([key, value]) => {
        generatedUrl.searchParams.append(key, String(value)); 
      });

      // Send URL along with the response
      return {
        url: generatedUrl.href,
        data: response.data,
      };
    });
};

type ContactSearchApi = {
  searchTerm: string;
};

const searchContacts = (args: ContactSearchApi) => {
  let url = config.BACKEND_BASE + PRODUCT.CONTACTS;
  let query = {
    search: args.searchTerm,
    paginate: true,
  };
  return axios.get(url, {
    params: query,
  });
};

export { listProducts, searchContacts };
