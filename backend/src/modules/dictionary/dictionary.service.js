import Dictionary from "../../models/Dictionary.model.js";

export const getDictionarySigns = async ({page = 1,limit = 20,search = ""}) => {
  const currentPage = Math.max(Number(page), 1);
  const currentLimit = Math.min(Math.max(Number(limit), 1), 50);

  const skip = (currentPage - 1) * currentLimit;

  const query = {};

  if (search.trim()) {
    query.signName = {
      $regex: search.trim(),
      $options: "i",
    };
  }

  const signs = await Dictionary.find(query)
    .select("_id signName")
    .sort({ signName: 1 })
    .skip(skip)
    .limit(currentLimit + 1)
    .lean();

  const hasMore = signs.length > currentLimit;

  if (hasMore) {
    signs.pop();
  }

  return {
    signs,
    page: currentPage,
    limit: currentLimit,
    hasMore,
  };
};

export const getDictionarySignById = async (id) => {
  const sign = await Dictionary.findById(id)
    .select(
      "_id signName meaning usage sourceType sourceName videoUrl"
    )
    .lean();

  if (!sign) {
    throw new Error("Dictionary sign not found");
  }

  return sign;
};