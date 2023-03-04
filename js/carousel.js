
class Carousel{

    /**
     * 
     * @param {HTMLElement} element 
     * @param {Object} options 
     * @param {Object} options.slideToScroll Number of element to scroll
     * @param {Object} options.slideVisible number of element visible
     * @param {bool} options.loop hide navigation
     */
    constructor(element,options ={}){
       this.element = element
       this.options = Object.assign({},{
        slideToScroll : 1,
        slideVisible : 1,
        loop: false
       },options)

      let children = [].slice.call(element.children)
      this.isMobile= false
      this.isIpad = false
      this.isLaptop = false
      this.currentItem = 0
      this.moveCallbacks =[]

      /* Modification du DOM*/

       this.root = this.createDivWithClass('carousel')
       this.container = this.createDivWithClass('carousel__container')
       this.root.setAttribute('tabindex','0')
       this.root.appendChild(this.container)
       this.element.appendChild(this.root)
       this.items = children.map((child) => {
       let item = this.createDivWithClass('carousel__item')
       item.appendChild(child)
        this.container.appendChild(item)
        return item
       })
       this.setCustomStyle()
       this.createNavigation()
       
       /* Event */
       this.moveCallbacks.map(cb => cb(0) )
       this.onWindowResize()
       window.addEventListener('resize',this.onWindowResize.bind(this))
       this.root.addEventListener('keyup',e=> {
        if(e.key === 'arrowRight' || e.key ==='Right'){
            this.next()
        }else if(e.key === 'arrowLeft' || e.key ==='Left'){
            this.prev()
        }
       })

    }

  

    createNavigation(){
        let nextButton = document.querySelector('.nextBtn')
        let prevButton = document.querySelector('.prevBtn')
        this.root.appendChild(nextButton)
        this.root.appendChild(prevButton)
        nextButton.addEventListener('click',this.next.bind(this))
        prevButton.addEventListener('click',this.prev.bind(this))
        if(this.options.loop === false){
            return
        }
        this.onMove(index =>{
            if(index === 0){
                prevButton.classList.add('carousel__prev--hidden')
            }else{
                prevButton.classList.remove('carousel__prev--hidden')

            }
            if(this.items[this.currentItem + this.slideVisible] === undefined){
                
                nextButton.classList.add('carousel__next--hidden')
            }else{
                nextButton.classList.remove('carousel__next--hidden')

            }
        })
    }

    next(){
        this.goToItem(this.currentItem + this.slideToScroll)
    }
    prev(){
        this.goToItem(this.currentItem - this.slideToScroll)
    }
    /**
     * Move the carousel to the  element cible
     * @param {Number} index 
     */
    goToItem(index){
        if(index < 0){
            if(this.options.loop){
                this.items.length - this.slideVisible
            }else{
                return
            }
            
        }else if(index >= this.items.length || 
            (this.items[this.currentItem + this.slideVisible] === undefined
             && index >
            this.currentItem)){
                if(this.options.loop){
                    index =0
                }else{
                    return
                }
        }
        let translateX = (index * -100) / this.items.length
        this.container.style.transform = 'translate3d('+ translateX +'%,0,0)'
        this.currentItem = index
        this.moveCallbacks.map(cb => cb(index) )
    }

    
    onMove(cb){
        this.moveCallbacks.push(cb)
    }

    onWindowResize(){
        let mobile = window.innerWidth >= 100 &&  window.innerWidth <= 760
        let ipad = window.innerWidth >760 &&  window.innerWidth <= 1000
        let laptop= window.innerWidth >=1200
        if(mobile !== this.isMobile){
            this.isMobile = mobile
            this.setCustomStyle()
            this.moveCallbacks.map(cb => cb(this.currentItem) )
        }
        if(ipad !== this.isIpad){
             this.isIpad = ipad
            this.setCustomStyle()
            this.moveCallbacks.map(cb => cb(this.currentItem) )
        }
        if(laptop !==  this.isLaptop){
             this.isLaptop = laptop
            this.setCustomStyle()
            this.moveCallbacks.map(cb => cb(this.currentItem) )
        }
        
    }
    /**
     * Apply the correct value for carousel's item
     */
    setCustomStyle()
    {
        let ratio = this.items.length / this.slideVisible
        this.container.style.width = (ratio * 100) + '%'
        this.items.map(item => item.style.width = ((100 / this.slideVisible)/ratio)+'%')

    }


    /**
     * 
     * @param {string} className 
     * @returns {HTMLElement}
     */
   createDivWithClass(className) {
        let div = document.createElement('div')
        div.setAttribute('class',className)
        return div
    }

    /**
     * @returns {number}
     */

    get  slideToScroll(){
        return this.isMobile ? 1 : this.options.slideToScroll || this.isIpad ? 1 : this.options.slideToScroll || this.isLaptop ? 1 : this.options.slideToScroll
    }
     /**
     * @returns {number}
     */

    get slideVisible(){
        return this.isMobile ? 1 : this.options.slideVisible || this.isIpad ? 2 : this.options.slideVisible || this.isLaptop ? 3 : this.options.slideVisible
    }
    
}



//poujr charger DOM
document.addEventListener('DOMContentLoaded',function(){
    new Carousel(document.querySelector('#carousel1'),{
        slideToScroll:1,
        slideVisible : 3,
        loop : true
    })
})
