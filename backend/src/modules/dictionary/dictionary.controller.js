import {getDictionarySigns,getDictionarySignById} from "./dictionary.service.js";

export const getDictionarySignsFunct = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;

    const data = await getDictionarySigns({
      page,
      limit,
      search,
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to fetch dictionary signs",
    });
  }
};

export const getDictionarySignByIdFunct = async (req, res) => {
  try {
    const { id } = req.params;

    const sign = await getDictionarySignById(id);

    return res.status(200).json({
      sign,
    });
  } catch (error) {
    if (error.message === "Dictionary sign not found") {
      return res.status(404).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: error.message || "Failed to fetch dictionary sign",
    });
  }
};