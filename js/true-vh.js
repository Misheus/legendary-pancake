(()=>{
    document.body.style.setProperty('--true-vh', '100vh')
    let div = document.createElement('div')
    div.style.position = 'fixed'
    div.style.bottom = '0'
    div.style.width = '0'
    div.style.height = '0'
    document.body.appendChild(div)
    window.addEventListener('resize', ()=>{
        document.body.style.setProperty('--true-vh', div.offsetTop+'px')
    })
    setTimeout(()=>{
        document.body.style.setProperty('--true-vh', div.offsetTop+'px')
    }, 25)
})()