// ajoute  un element html
function html(parent,nom,classe,text) {
    let e=document.createElement(nom);
    parent.appendChild(e);
    if( classe!="" ) e.setAttribute("class",classe);
    e.innerHTML=text;
    return e;
}

// retourne le texte  d'un  noeud  XML
function text(node)  { return node.childNodes[0].nodeValue; }


function xmlRecette2HTML(parent,xml) {
    console.log("process XML",xml);
    let e=document.createElement("div");
    e.setAttribute("class","recette");
    e.setAttribute("userid",xml.userid);
    parent.appendChild(e);
    
    // Nom
    html(e,"div","nom",text(xml.querySelector("nom")));

    // Categories
    // ul class=cat li li li
    let ul=html(e,"ul","categorie","");
    let li=xml.querySelectorAll("categorie");
    for(let i=0;i<li.length;i++) html(ul,"li","",text(li[i]));


    ////////////////////
    // nom
    // categories (X)
    // motcles (X)
    // source
    // image
    // auteur
    // licence
    // extra (nom,val ) -> (X) dd dt
    // description
    //
    ////////////////////////
    // Parties
    //   partie1
    //     ingredients1.1, ingredients1.2, ...
    //     etapes1.1, etapes1.2, ...
    //   partie2
    //     ingredients2.1, ingredients2.2, ...
    //     etapes2.1, etapes2.2,  ...
    //   ...
    //////////////////////////
    // Ingredients
    //   partie1
    //     ingredients1.1
    //     ingredients1.2
    //   partie2
    //     ingredients2.1
    //     ingredients2.2
    //   ...
    // Etapes
    //   partie1
    //     etape1.1
    //     etape1.2
    //   partie2
    //     etape2.1
    //     etape2.2
    //   ...
    ////////////////////////////
    // Index des Ingredients  ->  liste les recettes par ingredient
    //   tous les ingredients  avec  un  <index> dedans
    //   ingredient1 -> recette1, recette2, ...
    // Index des parties -> liste les parties qui ont un index
    //   partie1 ->recette1, recette2,  ...
    // Glossaire -> liste tout ce qui a un <glossaire>
    //   ingredient1 -> glossaire
    //   ...
}


/*
const myPromise1 = new Promise(resolve => setTimeout(() => {
  return resolve("P1 done");
}, 1000));

const myPromise2 = new Promise(resolve => setTimeout(() => {
  return resolve("P2 done!");
}, 2000));

const myPromise3 = new Promise(resolve => setTimeout(() => {
  return resolve("P3 done!");
}, 3000));
*/


function getJSON(url) {
    return new Promise(resolve => {
        console.log("getJSON",url);
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            //console.log(this.readyState,this.status);
            if(this.readyState == 4 ) {
                if( this.status==404 )  {
                    alert("URL introuvable: "+url);
                    resolve(null);
                }else if( this.status == 200 ) {
                    if( xhttp.responseText==null )  {
                        alert("Erreur dans le JSON (voir console): "+url);
                        resolve(null);
                    }else{
			try {
                        	resolve(JSON.parse(xhttp.responseText));
			} catch (e) {
				alert("Erreur  JSON: "+e);
				resolve(null);
			}
                    }
                }
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    }
    );
}

function getXML(url) {
    return new Promise(resolve => {
        console.log("getXML",url);
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            //console.log(this.readyState,this.status);
            if(this.readyState == 4 ) {
                if( this.status==404 )  {
                    alert("URL introuvable: "+url);
                    resolve(null);
                }else if( this.status == 200 ) {
                    if( xhttp.responseXML==null )  {
                        alert("Erreur dans le XML (voir console): "+url);
                        resolve(null);
                    }else{
                        resolve(xhttp.responseXML);
                    }
                }
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    }
    );
}


function applyXSL(parent,xsl,xml)  {
    if( xsl!=null && xml!=null )  {
	    if (document.implementation && document.implementation.createDocument) {
		let xsltProcessor = new XSLTProcessor();
		k=xsltProcessor.importStylesheet(xsl);
		let resultDocument = xsltProcessor.transformToFragment(xml, document);
		if( parent!=null ) parent.appendChild(resultDocument);
		return resultDocument;
	    }
    }
}

async function init(configURL)  {
    console.log("1005recettes!");
    let recettes=document.getElementById("recettes");

    /*
    console.log("1");
    await myPromise1;
    console.log("2");
    await myPromise2;
    console.log("3");
    await myPromise3;
    console.log("done");
    */

    let config=await getJSON(configURL);
    console.log("JSON config:",config);

    // modele XSL pour afficher  transformer  une recette XML  en  HTML
    let xsl=await getXML("recette-modele1.xsl"); //  voir  aussi  "recette-modele2.xsl"
    console.log("XSL is",xsl);

    // lit toutes  les recettes  dans un tableau xmls
    xmls=[];
    for(let i=0;i<config.recettes.length;i++) {
	    let r=config.recettes[i];
	    console.log("Recette "+i+":",r);
	    let xml=await getXML(r);
    	    console.log("Recette "+i+" XML:",xml);
	    xmls.push(xml);
    }

    // transforme chaque XML avec le XSL, et  ajoute le html  dans recettes
    for(let i=0;i<xmls.length;i++) {
	    applyXSL(recettes,xsl,xmls[i]);
    }

    // init les unites a metrique
    unites("metrique");  //  ou "imperial"

}

/****** pour les unites *******/
/** <span class="quantite" sys="metrique" u="g"> **/
/** associe "invisible" aux autres systeme **/
/** **/
function unites(s) {
    let e=document.querySelectorAll(".quantite[sys]");
    for(let i=0;i<e.length;i++) {
        if( e[i].getAttribute("sys")==s ) {
            e[i].classList.remove("invisible");
        }else{
            e[i].classList.add("invisible");
        }
    }
}