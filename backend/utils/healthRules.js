function filterRecipes(recipes, conditions) {

  return recipes.filter(recipe => {

    if (conditions.includes("diabetes") && recipe.nutrition.sugar > 25)
      return false;

    if (conditions.includes("hypertension") && recipe.nutrition.sodium > 500)
      return false;

    if (conditions.includes("obesity") && recipe.nutrition.calories > 700)
      return false;

    return true;

  });

}

module.exports = filterRecipes;