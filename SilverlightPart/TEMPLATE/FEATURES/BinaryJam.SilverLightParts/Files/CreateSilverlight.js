
function createSilverlight(controlHost, xamlSource, controlName, controlWidth, controlHeight, mainSceneObject)
{	
	var scene = mainSceneObject;

	Silverlight.createObjectEx({
		source: xamlSource, 
		parentElement:document.getElementById(controlHost), 
		id:controlName, 
		properties:{
			width:controlWidth, 
			height:controlHeight, 
			background:'white', 
			isWindowless:'false', 
			framerate:'24', 
			enableFramerateCounter:false, 
			version:'1.0'
		}, 
		events:{
			onLoad: BinaryJamSFSPart.createDelegate(scene, scene.handleLoad )
		}, 
		context:null});
	
}

