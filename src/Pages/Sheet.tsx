// Work with SheetDB API

const readAt = () => {
    fetch('https://sheetdb.io/api/v1/r59b8ra8hnr11/cells/J11?sheet=Ranges for Quiz')
        .then((response) => response.json())
        .then((data) => console.log(data));

    fetch('https://sheetdb.io/api/v1/r59b8ra8hnr11?limit=50&sheet=Ranges for Quiz')
        .then((response) => response.json())
        .then((data) => console.log(data));
}


const Sheet = () => {
    readAt()
    return (<>
    </>);
}

export default Sheet;