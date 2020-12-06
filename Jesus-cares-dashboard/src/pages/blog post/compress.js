const max_width = 800;
////
const compress = async  data =>{
    const promise = new Promise((resolve, reject)=>{
        const image = data;
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onloadend=e=>{
            const img = document.createElement('img');
            img.src = e.target.result;
            img.onload = e=>{
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const ratio = max_width / img.width;
                canvas.width = max_width;
                canvas.height = ratio * img.height;

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                // const newImage2 = ctx.canvas.toDataURL('image/jpeg', 0.7);
                const newImage = ctx.canvas.toBlob(e=>{ resolve(e)},'image/jpeg', 0.7);
                // console.log(newImage)
                // resolve(newImage2)
            }
        }
    });
    const result = await promise;
    // console.log(result)
    return result
}


export default compress;