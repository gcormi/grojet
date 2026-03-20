/**
 * Studio Pro - Logique Spécifique PDF (Vignettes et Recherche)
 * Utilise PDF.js en local.
 */

let documentPdfGlobal = null;

/**
 * Génère les vignettes de prévisualisation pour le bandeau du bas.
 */
async function genererVignettes(fluxDonnees) {
    logDiagnostic("Début de génération des vignettes...");
    const conteneur = $('#thumb-strip').empty();
    
    try {
        const pdf = await pdfjsLib.getDocument({data: fluxDonnees}).promise;
        documentPdfGlobal = pdf;
        
        for(let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            // Échelle réduite pour les vignettes
            const zoom = page.getViewport({scale: 0.15});
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.height = zoom.height;
            canvas.width = zoom.width;

            await page.render({canvasContext: ctx, viewport: zoom}).promise;
            
            const vignette = $(`<div class="thumb-item" onclick="allerAPage(${i})">
                <img src="${canvas.toDataURL()}" style="width:100%">
                <div style="position:absolute; bottom:0; width:100%; text-align:center; font-size:10px; background:rgba(0,0,0,0.6); color:white">${i}</div>
            </div>`);
            
            conteneur.append(vignette);
        }
        logDiagnostic(`${pdf.numPages} vignettes générées.`, "success");
    } catch (e) {
        logDiagnostic("Erreur vignettes: " + e, "error");
    }
}

/**
 * Recherche un terme dans tout le document PDF.
 */
async function rechercherTexte() {
    const terme = $('#input-recherche').val().toLowerCase();
    if(!terme || !documentPdfGlobal) return;
    
    const zoneResultats = $('#resultats-recherche').empty().append("<div>Recherche en cours...</div>");
    logDiagnostic("Recherche de : " + terme);
    
    let resultats = [];
    for(let i = 1; i <= documentPdfGlobal.numPages; i++) {
        const page = await documentPdfGlobal.getPage(i);
        const texte = await page.getTextContent();
        const contenu = texte.items.map(item => item.str).join(" ").toLowerCase();
        
        if(contenu.includes(terme)) {
            resultats.push(i);
        }
    }

    zoneResultats.empty();
    if(resultats.length > 0) {
        zoneResultats.append(`<div style="margin-bottom:10px">${resultats.length} résultat(s) trouvé(s) :</div>`);
        resultats.forEach(p => {
            zoneResultats.append(`<button class="btn" style="width:100%; margin-bottom:5px; font-size:0.7rem;" onclick="allerAPage(${p})">Page ${p}</button>`);
        });
    } else {
        zoneResultats.append("<div>Aucun résultat trouvé.</div>");
    }
}
