


function executeBasedOnTime(func) {
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
  
    // Раз в день (в полночь)
    if (hours === 0 && minutes === 0 && seconds === 0) {
      func("daily");
    }
    
    // Раз в час
    if (minutes === 0 && seconds === 0) {
      func("hourly");
    }
  
    // Раз в минуту
    func("every minute");
  }
module.exports = executeBasedOnTime