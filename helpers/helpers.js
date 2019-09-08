const dateGrabber = () => {
    const date = new Date();

    let dd = date.getDate();
    if (dd<10) dd = '0' + dd;

    let mm = date.getMonth()+1;
    if (mm<10) mm = '0' + mm;

    let yyyy = date.getFullYear();

    return `${yyyy}-${mm}-${dd}`;
};

module.exports = {
    dateGrabber: dateGrabber
};