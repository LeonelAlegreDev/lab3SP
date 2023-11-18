class Loader
{
    static Show(){
        document.getElementById("loader").style.display = "flex";
        body.style.overflowY = 'hidden';
    }

    static Hide(){
        document.getElementById("loader").style.display = "none";
        document.body.style.overflowY = "auto";
    }
}

export default Loader;