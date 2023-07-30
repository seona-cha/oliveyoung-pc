// 전체 카테고리 토글
$('#gnbToggle').click(function(){
    $(this).toggleClass('on');
    $('.cate-all').toggle();
})
$('#gnbClose').click(function(){
    $('#gnbToggle').removeClass('on');
    $('.cate-all').hide();
})

// 전체 카테고리 불러오기
fetch('./assets/data/category.json')
    .then(res=>res.json())
    .then(json=>{

        data=json.items; // 전체 데이터

        // 3단으로 분리
        list01 = data.filter(function(parm){
            return parm.id <= 12;
        })
        list02 = data.filter(function(parm){
            return 13 <= parm.id && parm.id <= 16;
        })
        list03 = data.filter(function(parm){
            return parm.id >= 17;
        })

        // 카테고리 출력 폼
        function cateAll(listNum, className){
            let html=``;

            listNum.forEach(element => {

                html+=`<li class="cate-item">
                            <a href="#${element.id}">${element.name}</a>
                            <ul class="sub-list">`

                //소분류
                sub = element.submenu;
                sub.forEach(element=>{
                    html+=`<li class="sub-item"><a href="#${element.id}">${element.name}</a></li>`
                })

                html+=`</ul>
                    </li>`

            });
            
            $(className).html(html);
        }
        // 카테고리 불러오기
        cateAll(list01,".gnb .list01");
        cateAll(list02,".gnb .list02");
        cateAll(list03,".gnb .list03");
    })

// 메인 슬라이더
fetch('./assets/data/mainSlider.json')
    .then(res=>res.json())
    .then(json=>{
        data=json.items;
        let html=``;

        data.forEach(element => {
            html+=`
            <div class="swiper-slide">
                <a href="${element.linkUrl}">
                    <figure class="img-box">
                        <img src="${element.thumbUrl}" alt="${element.thumbAlt}">
                    </figure>
                    <div class="text-box ${element.theme}">
                        <em>${element.subject}</em>
                        <h3>${element.title}</h3>
                        <p>${element.desc}</p>
                    </div>
                </a>
            </div>
            `
            $(`.sc-main-slider .swiper-wrapper`).html(html)
        });
    })

const mainSlider = new Swiper(".sc-main-slider .swiper",{
    effect:"fade",
    loop:true,
    autoplay:{
        delay:4000,
        disableOnInteraction: false        
    },
    navigation:{
        nextEl:".sc-main-slider .next",
        prevEl:".sc-main-slider .prev"
    },
    pagination:{
        el:".sc-main-slider .pagination",
        type: "fraction"
    }
})

// 재생, 정지 버튼
const mainSlider_start = $(`.sc-main-slider .play`);
const mainSlider_pause = $(`.sc-main-slider .pause`);

mainSlider_start.click(function(){
    mainSlider.autoplay.start();
    $(this).css("display","none");
    $(mainSlider_pause).css("display","block");
});
mainSlider_pause.click(function(){
    mainSlider.autoplay.stop();
    $(this).css("display","none");
    $(mainSlider_start).css("display","block");
})

// 슬라이더 좌측 카테고리
fetch('./assets/data/mainMenu.json')
    .then(res=>res.json())
    .then(json =>{
        data=json.items;

        let html=``;
        data.forEach(element =>{
            
            //mdpick 출력 함수
            function mdpick(element){
                html+=`
                    <div class="md-pick">
                        <a href="${element.mdpick["linkUrl"]}">
                            <div class="text-box">
                                <span class="md-title">MD's pick</span>
                                <strong>${element.mdpick["title"]}</strong>
                                <p>${element.mdpick["subTitle"][0]}<br>${element.mdpick["subTitle"][1]}</p>
                `
                if(element.mdpick["cost"]){
                    html+=`    
                        <del class="cost">${element.mdpick["cost"].toLocaleString()}원</del>
                    `
                }
                html+=` 
                                <em class="sale">${element.mdpick["sale"].toLocaleString()}<span>원</span></em>
                            </div>
                            <figure class="img-box">
                                <img src="${element.mdpick["thumbUrl"]}" alt>
                            </figure>
                        </a>
                    </div>
                `
            }

            
            // 카테고리 출력 폼
            html+=`
            <li class="cate-item">
                <a href="#">${element.name}</a>
            `
            // 대분류 mdpick 있으면 호출
            if (element.mdpick){
                mdpick(element);
            }
            
            // 소분류
            if (element.sub){
                html+=`<ul class="sub-list">`

                sub2 = element.sub;
                sub2.forEach(element=>{
                    html+=`<li class="sub-item"><a href="#"><span>${element.name}</span></a>`
                    //소분류 mdpick 있으면 호출
                    if (element.mdpick){
                        
                         mdpick(element);
                    }
                    html+=`</li>`
                })

                
                html+=`</ul>`

            }
            
           

            html+=`</li>`
        })
        html+=`<li class="cate-item"><a href="#awards">AWRADS</a></li>`

        $(`.sc-cate .cate-list`).html(html);
    })

// 슬라이더 하단 배너 
fetch(`./assets/data/banner.json`)
    .then(res=>res.json())
    .then(json =>{
        data = json.items;

        html=``;

        data.forEach(element=>{
            html+=`
            <li class="banner-item">
                <a href="${element.linkUrl}"><img src="${element.thumbUrl}" alt="${element.title}"></a>
            </li>
            `
        })
        $(`.sc-banner .banner-list`).html(html)
    })

// 유사한 고객님이 많이 구매했어요
current1 = 1;
function similar(i,j){
    fetch(`./assets/data/product.json`)
        .then(res=>res.json())
        .then(json =>{
            data = json.items;
            html=``;
    
            while(i < j) {
                element = data[i];
                
                html+=`
                <li class="prd-item">
                    <a href="${element.linkUrl}"></a>
                    <figure class="img-box">
                `
    
                if(element.best){
                    html+=`<span class="best">베스트</span>`
                }
    
                html+=`
                    <img src="${element.thumbUrl}" alt>
                </figure>
                <div class="text-box">
                    <strong class="prd-name">${element.productName}</strong>
                    <div class="info-wrap">
                        <p class="price">`
                        if(element.cost){
                            html+=`<del class="cost">${element.cost.toLocaleString()}<span>원</span></del>`
                        }   
                        html+=`
                            <em class="sale">${element.sale.toLocaleString()}<span>원</span></em>
                        </p>
                `
    
                if(element.tag){
                    html+=`<p class="tag">`;
    
                    prdTag = element.tag;
                    prdTag.forEach(element=>{
                        if(element == '세일'){
                            html+=`<span class="sale">${element}</span>`
                        }
                        if(element == '쿠폰'){
                            html+=`<span class="coupon">${element}</span>`
                        }
                        if(element == '증정'){
                            html+=`<span class="gift">${element}</span>`
                        }
                        if(element == '오늘드림'){
                            html+=`<span class="today">${element}</span>`
                        }
                    })
                    
                    html+=`</p>`;
                }
    
                html+=`
                            <a href="#" class="cart"><span class="blind">장바구니</span></a>
                        </div>
                    </div>
                </li>
                `
                        
                i++; 
            }
            
            $(`.sc-similar .prd-list`).html(html)
        })
}

similar(0,2);
$('.sc-similar .other-btn').click(function(){
    if(current1 == 1 ){
        similar(2,4);
        current1 = 2;
    }else if(current1 == 2){
        similar(4,6);
        current1 = 3;
    }else if(current1 == 3){
        similar(6,8);
        current1 = 4;
    }else if(current1 == 4){
        similar(8,10);
        current1 = 5;
    }else{
        similar(0,2);
        current1 = 1;
    }
    
    $('.sc-similar .other-btn .current').html(current1);
}) 

// 고객님을 위한 추천 상품
current2 = 1;
function recomm(i,j){
    fetch(`./assets/data/product.json`)
        .then(res=>res.json())
        .then(json =>{
            data = json.items;
            html=``;
    
            while(i < j) {
                element = data[i];
                
                html+=`
                <li class="prd-item">
                    <a href="${element.linkUrl}"></a>
                    <figure class="img-box">
                `
    
                if(element.best){
                    html+=`<span class="best">베스트</span>`
                }
    
                html+=`
                    <img src="${element.thumbUrl}" alt>
                </figure>
                <div class="text-box">
                    <strong class="prd-name">${element.productName}</strong>
                    <div class="info-wrap">
                        <p class="price">`
                        if(element.cost){
                            html+=`<del class="cost">${element.cost.toLocaleString()}<span>원</span></del>`
                        }   
                        html+=`
                            <em class="sale">${element.sale.toLocaleString()}<span>원</span></em>
                        </p>
                `
    
                if(element.tag){
                    html+=`<p class="tag">`;
    
                    prdTag = element.tag;
                    prdTag.forEach(element=>{
                        if(element == '세일'){
                            html+=`<span class="sale">${element}</span>`
                        }
                        if(element == '쿠폰'){
                            html+=`<span class="coupon">${element}</span>`
                        }
                        if(element == '증정'){
                            html+=`<span class="gift">${element}</span>`
                        }
                        if(element == '오늘드림'){
                            html+=`<span class="today">${element}</span>`
                        }
                    })
                    
                    html+=`</p>`;
                }
    
                html+=`
                            <a href="#" class="cart"><span class="blind">장바구니</span></a>
                        </div>
                    </div>
                </li>
                `
                        
                i++; 
            }
            
            $(`.sc-recomm .prd-list`).html(html)
        })
}

recomm(5,7);
$('.sc-recomm .other-btn').click(function(){
    if(current2 == 1 ){
        recomm(10,12);
        current2 = 2;
    }else if(current2 == 2){
        recomm(12,14);
        current2 = 3;
    }else if(current2 == 3){
        recomm(14,16);
        current2 = 4;
    }else if(current2 == 4){
        recomm(16,18);
        current2 = 5;
    }else{
        recomm(3,5);
        current2 = 1;
    }
    
    $('.sc-recomm .other-btn .current').html(current2);
}) 

// Weekly Special
fetch('./assets/data/weekly.json')
    .then(res=>res.json())
    .then(json=>{
        data = json.items;
        
        html=``;
        data.forEach(element =>{
            html+=`
            <li class="weekly-item ${element.theme}">
                <a href="${element.linkUrl}">
                    <figure class="img-box"><img src="${element.thumbUrl}" alt></figure>
                    <div class="text-box">
                        <h3>${element.title[0]}<br>${element.title[1]}</h3>
                        <p>${element.desc}</p>
                    </div>
                </a>
            </li> 
            `
        })
        $('.sc-weekly .weekly-list').html(html);
    })

// 이벤트 리스트 불러오기
fetch('./assets/data/event.json')
    .then(res=>res.json())
    .then(json=>{
        data = json.items;
        html=``;

        data.forEach(element =>{
            html+=`
            <div class="swiper-slide">

                <div class="group-head">
                    <a href="${element.linkUrl}">
                        <div class="bg-box">
                            <img src="${element.backgroundUrl}" alt>
                        </div>
                        <div class="text-box ${element.theme}">
                            <h3>${element.title[0]}<br>${element.title[1]}</h3>
                            <p>${element.subTitle}</p>
                        </div>
                    </a>
                </div>

                <ul class="prd-list prd-list02 event${element.id}">
                        
                </ul>
                </div>
            `
           
        })

    // 이벤트 상품 불러오기 
    fetch('./assets/data/product.json')
        .then(res=>res.json())
        .then(json=>{
            data = json.items;
            function sortData(sortId){
                // 이벤트 ID값이 일치하는 상품 필터링
                eventData = data.filter(function(parm){
                    return parm.eventId === sortId;
                })

                let html=``;

                eventData.forEach(element=>{
                    html+=`
                    <li class="prd-item">
                        <a href="${element.linkUrl}"></a>
                        <figure class="img-box">
                    `
                        if(element.best){
                            html+=`<span class="best">베스트</span>`
                        }
                        html+=`
                            <img src="${element.thumbUrl}" alt>
                            <a href="#like" class="like"><span class="blind">찜하기</span></a>
                        </figure>
                        <div class="text-box">
                            <em class="brand-name">${element.brand}</em>
                            <strong class="prd-name">${element.productName}</strong>
                            <div class="info-wrap">
                                <p class="price">
                                `
                                if(element.cost){
                                    html+=`<del class="cost">${element.cost.toLocaleString()}<span>원</span></del>`
                                }   
                                html+=`
                                    <em class="sale">${element.sale.toLocaleString()}<span>원</span></em>
                                </p>
                                `
                                if(element.tag){
                                    html+=`<p class="tag">`;
                    
                                    prdTag = element.tag;
                                    prdTag.forEach(element=>{
                                        if(element == '세일'){
                                            html+=`<span class="sale">${element}</span>`
                                        }
                                        if(element == '쿠폰'){
                                            html+=`<span class="coupon">${element}</span>`
                                        }
                                        if(element == '증정'){
                                            html+=`<span class="gift">${element}</span>`
                                        }
                                        if(element == '오늘드림'){
                                            html+=`<span class="today">${element}</span>`
                                        }
                                    })
                                    
                                    html+=`</p>`;
                                }
                                html+=`
                            </div>
                        </div>
                    </li>
                    `
                })
                $(`.sc-event .event${sortId}`).html(html)
            }
            sortData(1);
            sortData(2);
            sortData(3);
        })
        
    html+=`
    `
    
    $('.sc-event .swiper-wrapper').html(html);
})

// 이벤트 슬라이더
const eventSlider = new Swiper(".sc-event .swiper",{
    loop:true,
    slidesPerView: 2,
    slidesPerGroup: 2,
    spaceBetween:20,
    navigation:{
        nextEl:".sc-event .next",
        prevEl:".sc-event .prev"
    },
    pagination:{
        el:".sc-event .pagination",
        clickable : true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + "</span>";
          }
    }
})
// 키워드

current3 = 1;
function keywords(i,j){
    fetch('./assets/data/keywords.json')
        .then(res=>res.json())
        .then(json=>{
            data=json.items;
            html=``;

            while(i < j){
                element = data[i];
                
                html+=`
                <li class="keyword-item">
                    <a href="${element.linkUrl}">
                        <figure class="img-box">
                            <img src="${element.thumbUrl}" alt">
                        </figure>
                        <div class="text-box">
                            <h3>${element.title}</h3>
                            <p>${element.subTitle}</p>
                        </div>
                    </a>
                </li> 
                `
    
                i++;
            }
            $('.sc-keyword .keyword-list').html(html);
        });
}
        
keywords(0,2);
$('.sc-keyword .other-btn').click(function(){
    if(current3 == 1 ){
        keywords(2,4);
        current3 = 2;
    }else if(current3 == 2){
        keywords(4,6);
        current3 = 3;
    }else{
        keywords(0,2);
        current3 = 1;
    }
    $('.sc-keyword .other-btn .current').html(current3);
})         
// 오직 올리브영에서만
fetch('./assets/data/slideBanner.json')
    .then(res=>res.json())
    .then(json=>{
        data=json.items;
        html=``
        data.forEach(element=>{
            html+=`
            <div class="swiper-slide">
                <a href="${element.linkUrl}">
                    <div class="img-box">
                        <img src="${element.thumbUrl}" alt="">
                    </div>
                    <div class="text-box ${element.theme}">
                        <h3>${element.title[0]}<br>${element.title[1]}</h3>
                        <p>${element.desc}</p>
                    </div>
                </a>
            </div>
            `
        })
        $('.sc-only .swiper-wrapper').html(html);
    })
// 오직 올리브영에서만 슬라이더
const bannerSlider = new Swiper(".sc-only .swiper",{
    loop:true,
    slidesPerView: 3,
    slidesPerGroup: 3,
    spaceBetween:10,
    pagination:{
        el:".sc-only .pagination",
        clickable : true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + "</span>";
          }
    }
})


// 이 상품 어때요? 상품 리스트 불러오기
fetch(`./assets/data/product.json`)
    .then(res=>res.json())
    .then(json =>{
        data = json.items;
        
        html=``;
        for(i=0;i<13;i++){
            element = data[i];

            html+=`
                    <li class="swiper-slide prd-item">
                        <a href="${element.linkUrl}"></a>
                        <figure class="img-box">
                    `
                        if(element.best){
                            html+=`<span class="best">베스트</span>`
                        }
                        html+=`
                            <img src="${element.thumbUrl}" alt>
                            <a href="#like" class="like"><span class="blind">찜하기</span></a>
                        </figure>
                        <div class="text-box">
                            <em class="brand-name">${element.brand}</em>
                            <strong class="prd-name">${element.productName}</strong>
                            <div class="info-wrap">
                                <p class="price">
                                `
                                if(element.cost){
                                    html+=`<del class="cost">${element.cost.toLocaleString()}<span>원</span></del>`
                                }   
                                html+=`
                                    <em class="sale">${element.sale.toLocaleString()}<span>원</span></em>
                                </p>
                                `
                                if(element.tag){
                                    html+=`<p class="tag">`;
                    
                                    prdTag = element.tag;
                                    prdTag.forEach(element=>{
                                        if(element == '세일'){
                                            html+=`<span class="sale">${element}</span>`
                                        }
                                        if(element == '쿠폰'){
                                            html+=`<span class="coupon">${element}</span>`
                                        }
                                        if(element == '증정'){
                                            html+=`<span class="gift">${element}</span>`
                                        }
                                        if(element == '오늘드림'){
                                            html+=`<span class="today">${element}</span>`
                                        }
                                    })
                                    
                                    html+=`</p>`;
                                }
                                html+=`
                            </div>
                        </div>
                    </li>
                    `
        }
        
        $(`.sc-product .prd-list`).html(html)
    })
    
// 이 상품 어때요? 슬라이더
const prdSlider = new Swiper(".sc-product .swiper",{
    loop:true,
    slidesPerView: 4,
    slidesPerGroup: 4,
    spaceBetween:30,
    navigation:{
        nextEl:".sc-product .next",
        prevEl:".sc-product .prev"
    },
    pagination:{
        el:".sc-product .pagination",
        clickable : true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + "</span>";
          }
    }
})

// Healthy Life
fetch('./assets/data/healthy.json')
    .then(res=>res.json())
    .then(json=>{
        data=json.items;
        html=``;

        data.forEach(element=>{
            html+=`
            <li class="healthy-item ${element.theme}">
                <a href="${element.linkUrl}">
                    <figure class="img-box">
                        <img src="${element.thumbUrl}" alt>
                    </figure>
                    <div class="text-box">
                        <h3>${element.title}</h3>
                        <p>${element.desc[0]}<br>${element.desc[1]}</p>
                    </div>
                </a>
            </li>
            `
        })
        $(`.sc-healthy .healthy-list`).html(html)
    })

// 브랜드 탭 불러오기
fetch('./assets/data/brand.json')
    .then(res=>res.json())
    .then(json=>{
        data=json.items;
        html=``;

        data.forEach(element=>{
            html+=`
            <li class="tab-item">
                <a href="${element.linkUrl}" data-tab="#tab0${element.brandId}">${element.name}</a>
            </li>
            `
        })
        $(`.sc-brand .tab-list`).html(html)
    })
// 브랜드 리스트 불러오기
fetch('./assets/data/brand.json')
    .then(res=>res.json())
    .then(json=>{
        data=json.items;
        html=``;

        data.forEach(element=>{
            html+=`
            <div id="tab0${element.brandId}" class="swiper-slide">
                <div class="brand-area">
                    <a href="${element.linkUrl}">
                        <div class="img-box">
                            <img src="${element.backgroundUrl}" alt>
                        </div>
                        <div class="info-box">
                            <h3>${element.name}</h3>
                            <p>${element.likes.toLocaleString()}명이 좋아합니다.</p>
                        </div>
                    </a>
                </div>
                <ul class="prd-list prd-list03 brand${element.brandId}">
                
                </ul>
            </div>
            `
        })
        $(`.sc-brand .swiper-wrapper`).html(html)
        
        // 브랜드별 상품 리스트 불러오기
        fetch('./assets/data/product.json')
        .then(res=>res.json())
        .then(json=>{
            data = json.items;
            function sortData(brandId,sortId){
                // 브랜드가 일치하는 상품 필터링
                brandData = data.filter(function(parm){
                    return parm.brand === sortId;
                })
        
                let html=``;
        
                brandData.forEach(element=>{
                    html+=`
                    <li class="prd-item">
                        <a href="${element.linkUrl}"></a>
                        <figure class="img-box">
                            <img src="${element.thumbUrl}" alt>
                        </figure>
                        <div class="text-box">
                            <strong class="prd-name">${element.productName}</strong>
                            <p class="price">
                            `
                            if(element.cost){
                                html+=`<del class="cost">${element.cost.toLocaleString()}<span>원</span></del>`
                            }   
                            html+=`
                                <em class="sale">${element.sale.toLocaleString()}<span>원</span></em>
                            </p>
                            `
                            if(element.tag){
                                html+=`<p class="tag">`;
                
                                prdTag = element.tag;
                                prdTag.forEach(element=>{
                                    if(element == '세일'){
                                        html+=`<span class="sale">${element}</span>`
                                    }
                                    if(element == '쿠폰'){
                                        html+=`<span class="coupon">${element}</span>`
                                    }
                                    if(element == '증정'){
                                        html+=`<span class="gift">${element}</span>`
                                    }
                                    if(element == '오늘드림'){
                                        html+=`<span class="today">${element}</span>`
                                    }
                                })
                                
                                html+=`</p>`;
                            }
                            html+=`
                        </div>
                    </li>
                    `
                })
                $(`.sc-brand .brand${brandId}`).html(html);
            }
            sortData(1,"빌리프");
            sortData(2,"아벤느");
            sortData(3,"빌리프");
            sortData(4,"아벤느");
        })

    })



// 랭킹


// 계열사 바로가기
$('#relatedSite').click(function(){
    $('.related-list').toggle();
})
$(document).click(function(e){
    if($('.related-area').has(e.target).length === 0){
       $('.related-list').hide();
   }
})

// 맨위로 버튼
$('#topBtn a').click(function(a){
    a.preventDefault();
    window.scrollTo({
      top:0,
      behavior:"smooth"
    });
})

 $(window).scroll(function(){
    curr = $(window).scrollTop();
    if(curr == 0){
        $('#topBtn').removeClass('on');
    }else{
        $('#topBtn').addClass('on');
    }
})