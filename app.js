function GEBID(id) {
	return document.getElementById(id);
}

const productURLForm = GEBID('form_product_url');
const notification = GEBID('alert');

let product, productURL, variantAttributes = '';

productURLForm.addEventListener('submit', getProductData);

function getProductData(e) {
		e.preventDefault();
		
		let URL = GEBID('input_product_url').value;
		
		if(URL.indexOf('/collections/') > -1) {
			URL = URL.replace(/\/collections\/[\S]+\/p/, '/p');
		}
		
		productURL = URL + '/product.json';
		
		retrieveProductData();
		
		productURLForm.reset();
}

function retrieveProductData() {
	const xhr = new XMLHttpRequest;
	
	xhr.open('GET', productURL, true);
	
	productURLForm.className = 'spinner';
	
	xhr.addEventListener('error', function() {
		productURLForm.className = productURLForm.className.replace('spinner', '');
		
		notification.style.display = 'block';
		
		window.setTimeout(function() {
			
			notification.style.display = 'none';
		}, 3000);
	});
	
	xhr.addEventListener('load', viewProductData);
	
	xhr.send();
}

function viewProductData() {
	if(this.status == 200) {			
		product = JSON.parse(this.response).product;
		
		console.log(product);
		
		loadProductData();
		
		GEBID('product_table').style.display = 'table';
		
		productURLForm.className = productURLForm.className.replace('spinner', '');
	}
}

function loadProductData() {
	let variantImages = '';
	let options = {
        one: [],
        two: [],
        three: []
    };
	
	sortVariantOptions(product, options);
	
	showVariantOptions(options);
	
	for(let i = 0; i < product.images.length; i++) {
		variantImages += `<img width="150" src="${product.images[i].src}" onclick="changeImage(this)" class="thumbnail">`;
	}
	
	GEBID('product_name').innerText = product.title;
	GEBID('product_manufacturer').innerText = product.vendor;
	GEBID('product_type').innerText = product.product_type;
	GEBID('product_description').innerHTML = product.body_html;
	GEBID('product_options').innerHTML = variantAttributes;
	GEBID('variant_sku').innerText = product.variants[0].sku;
	GEBID('variant_price').innerText = product.variants[0].price;
	GEBID('base_image').src = product.image.src;
	GEBID('base_image').alt = product.image.alt;
	GEBID('gallery').innerHTML = variantImages;
}

function sortVariantOptions(obj, arr) {
    function selectArray(ov) {
        if(ov == 'option1') {
            return arr.one;
        } else if(ov == 'option2') {
            return arr.two;
        } else if(ov == 'option3') {
            return arr.three;
        }
    }

    for(let op = 1; op <= 3; op++) {
        let optNo = `option${op}`;
		let currentArray = selectArray(optNo);

        for(let v = 0; v < obj.variants.length; v++) {
            if(obj.variants[v][optNo] != null && currentArray.includes(obj.variants[v][optNo]) == false) {
                    currentArray.push(obj.variants[v][optNo]);
			}
        }
    }
}

function showVariantOptions(obj) {
	if(obj.one.length > 0) {
		for(let o1 = 0; o1 < obj.one.length; o1++) {
			variantAttributes += `<button class="btn-variant btn-variant-1" onclick="selectVariant(this);">${obj.one[o1]}</button>`;
		}
	}
	
	if(obj.two.length > 0) {
		variantAttributes += `<hr>`;
		
		for(let o2 = 0; o2 < obj.two.length; o2++) {
			variantAttributes += `<button class="btn-variant btn-variant-2" onclick="selectVariant(this);">${obj.two[o2]}</button>`;
		}
	}
	
	if(obj.three.length > 0) {
		variantAttributes += `<hr>`;
		
		for(let o3 = 0; o3 < obj.three.length; o3++) {
			variantAttributes += `<button class="btn-variant btn-variant-3" onclick="selectVariant(this);">${obj.three[o3]}</button>`;
		}
	}
}

function selectVariant(btn) {
	let btnClass = 'btn-variant-';
	let variantTitle = '';
	
	if(btn.className.indexOf('1') > 0) {
		btnClass += '1';
	} else if(btn.className.indexOf('2') > 0) {
		btnClass += '2';
	} else if (btn.className.indexOf('3') > 0) {
		btnClass += '3';
	}
	
	let buttons = document.getElementsByClassName(btnClass);
	
	for(let b = 0; b < buttons.length; b++) {
		buttons[b].className = buttons[b].className.replace(' active-option', '');
	}
	
	btn.className += ' active-option';
	
	let activeVariants = document.getElementsByClassName('active-option');
	
	for(let av = 0; av < activeVariants.length; av++) {
		variantTitle += activeVariants[av].innerText + ' / ';
	}
	
	variantTitle = variantTitle.slice(0, -3);
	 
	 for(let pv = 0; pv < product.variants.length; pv++) {
		 if(product.variants[pv].title == variantTitle) {
			GEBID('variant_sku').innerText = product.variants[pv].sku;
			GEBID('variant_price').innerText = product.variants[pv].price;
		 }
	 }
}

function changeImage(thumb) {
	GEBID('base_image').src = thumb.src;
}