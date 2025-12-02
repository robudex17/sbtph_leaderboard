
export const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]

export const monthMap = {
      January: "01",
      February: "02",
      March: "03",
      April: "04",
      May: "05",
      June: "06",
      July: "07",
      August: "08",
      September: "09",
      October: "10",
      November: "11",
      December: "12"
    };


export const getStarClass = (rating, index) => {
  const fullStar = 'text-yellow-500';
  const halfStar = 'text-yellow-300';
  const emptyStar = 'text-gray-300';

  const decimalPart = rating - Math.floor(rating);
  if (index <= Math.floor(rating)) {
    return fullStar;
  } else if (index - 1 < decimalPart) {
    return halfStar;
  } else {
    return emptyStar;
  }
};


export const getWholeNumberPercentage = (target, shipok) => {
      if (Number(target) != 0 && Number(shipok) != 0) {
        const percentage = ((shipok / target) * 100).toFixed(2)
        const roundOff = Math.round(percentage)
        return roundOff + '%'
      }
      return '0%'
    }

export  const setRatingNameColor = (agent) => {
  if (agent.ratings_name == 'EXCEPTIONAL') {
    return 'text-purple-500'
  }
  
  if (agent.ratings_name == 'VERY SATISFACTORY') {
    return 'text-blue-400'
  }

  if (agent.ratings_name == 'SATISFACTORY') {
    return 'text-green-600'
  }
  if (agent.ratings_name == 'NEEDS IMPROVEMENT') {
    return 'text-yellow-500'
  }

  if (agent.ratings_name == 'POOR') {
    return 'text-red-600'
  }

    if (agent.ratings_name == 'INCOMPLETE RATING') {
    return 'text-orange-400'
  }
}

export const setRatingColor = (agent) => {
  if (agent.final_ratings >= 5 ) {
    return 'text-purple-600'
  }
  
  if (agent.final_ratings >= 4 && agent.final_ratings < 5) {
    return 'text-blue-400'
  }

  if (agent.final_ratings >= 3 && agent.final_ratings < 4) {
    return 'text-green-600'
  }
  if (agent.final_ratings >= 2 && agent.final_ratings < 3) {
    return 'text-yellow-600'
  }

  if (agent.final_ratings <= 1 && agent.final_ratings < 2) {
    return 'text-red-600'
  }
}
      

