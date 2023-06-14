


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

    static convertToDate(text) {
        const parts = text.split('/');
        const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        const date = new Date(formattedDate);
        return date;
    }

    //2023-05-15 -> 5/15/2023
    static reformat(text) {
        const parts = text.split('/');
        const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        const date = new Date(formattedDate);
        return date;
    }

    static getDayOfWeek(date){
        const daysOfWeek = ["CN", "T.2", "T.3", "T.4", "T.5", "T.6", "T.7"];
        const dayIndex = date.getDay();
        return daysOfWeek[dayIndex];
    }
}

export default DateTimeUtils;