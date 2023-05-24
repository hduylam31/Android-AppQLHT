


class DateTimeUtils{

    static getNow(){
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
      
        // Đảm bảo định dạng dd/MM/yyyy
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;
      
        return `${formattedDay}/${formattedMonth}/${year}`;
    }
}

export default DateTimeUtils;