
if (!window.BinaryJamSFSPart)
	window.BinaryJamSFSPart = {};


//the Javascript object here should define function specific to your webpart, but not specific 
//to an instance of a part (unless you pass in the name of the silverlight control  based on ClientID)

BinaryJamSFSPart.createDelegate = function(instance, method) {
	return function() {
        return method.apply(instance, arguments);
    }
}

BinaryJamSFSPart.Scene = function(myId, resourcePath) 
{
	this.id = myId;
	this.ClassResourcePath=resourcePath;
	this.PhotoItemsUrls= new Array();
	this.PhotoItems= new Array();
	this.clickDelegate=BinaryJamSFSPart.createDelegate(this, this.onPhotoItemClicked);
	this.NewLeftValue=0;
}

BinaryJamSFSPart.Scene.prototype =
{

	
	handleScrollPicturesLeftOn: function(sender, eventArgs)
	{
		this.ScrollingLeft=true;
		this.ScrollingRight=false;
		this.scrollTimer.begin();
	},
	
	handleScrollPicturesLeftOff: function(sender, eventArgs)
	{
		this.ScrollingLeft=false;
		this.ScrollingRight=false;
		
	
	},

	handleScrollPicturesRightOn: function(sender, eventArgs)
	{
	//boo;
		this.ScrollingLeft=false;
		this.ScrollingRight=true;
		this.scrollTimer.begin();
	},
	
	handleScrollPicturesRightOff: function(sender, eventArgs)
	{
		this.ScrollingLeft=false;
		this.ScrollingRight=false;
	
	},

	handleSliderShow: function(sender, eventArgs)
	{
	    this.ShowSlider.begin();
	    this.Showing=true;
	},

    handleSliderHide: function(sender, eventArgs)
	{
	    if (this.Showing) {
	        this.HideSlider.begin();
	        this.Showing=false;
	    }
	},	
	scrollTimerCompleted: function(sender, eventArgs)
	{
			
		if(this.ScrollingLeft )
		{

			this.PictureSelectScroll["Canvas.Left"] += 5;
			if (this.PictureSelectScroll["Canvas.Left"] > 0)
			{
			  this.PictureSelectScroll["Canvas.Left"] = 0;
			}
			else
				this.scrollTimer.begin();
		}
		else if(this.ScrollingRight )
		{

			var tmpWidth=(this.PictureSelectScroll.Width - this.PictureSelect.Width);
			if (tmpWidth < 0) return;
			
			this.PictureSelectScroll["Canvas.Left"] -= 5;
			if (this.PictureSelectScroll["Canvas.Left"] < (tmpWidth*-1))
				this.PictureSelectScroll["Canvas.Left"] = (tmpWidth*-1);
			else			
				this.scrollTimer.begin();
		}
		
	},
	
	// Sample event handler
	handleMouseDown: function(sender, eventArgs) 
	{
	    // The following line of code shows how to find an element by name and call a method on it.
	    // this.control.content.findName("Timeline1").Begin();
	    this.control.content.fullScreen = !this.control.content.fullScreen;
	},
	

    
    
    onPhotoItemClicked: function(sender,photoUrl,index) {
        if(this.CurrentIndex>=0)
            this.PhotoItems[this.CurrentIndex].target.findname("WhiteRec")["Fill"]="#FFFFFF";
        this.CurrentIndex=index;
        this.MainImage.Source=photoUrl;
        this.PhotoItems[this.CurrentIndex].target.findname("WhiteRec")["Fill"]="#ABABAB"; 
    },
    
	onKeyUp:function (sender, keyEventArgs) {
		if (keyEventArgs.key == 14) //Left
		{
		    if ((this.CurrentIndex - 1) >= 0)
		    {
    	        
                this.PhotoItems[this.CurrentIndex].target.findname("WhiteRec")["Fill"]="#FFFFFF";
    	        this.CurrentIndex--;
                this.PhotoItems[this.CurrentIndex].target.findname("WhiteRec")["Fill"]="#ababab";

		        this.MainImage.Source=this.PhotoItems[this.CurrentIndex].photoUrl;

		        var tmp=((this.CurrentIndex+1) * (this.ItemWidth + 5)); // Calculate items "Right" value

		        if(tmp < ((this.NewLeftValue - this.ItemWidth) * -1) )
		        {
                    var tmp1=this.NewLeftValue;
                    this.NewLeftValue=(tmp-5-this.PhotoItems[this.CurrentIndex].target.Width)*-1;
		            this.scrollIntoView.stop();
		            this.scrollIntoView.findname("XFrom").value = tmp1;
		            this.scrollIntoView.findname("XTo").value = this.NewLeftValue;
		            this.scrollIntoView.begin();		            
		            
		        }
		        
		    }
                
		}
		if (keyEventArgs.key == 16) //Right
		{
		    if ((1 + this.CurrentIndex) < this.PhotoItems.length)
		    {
                 this.PhotoItems[this.CurrentIndex].target.findname("WhiteRec")["Fill"]="#FFFFFF";
    	        this.CurrentIndex++;
                this.PhotoItems[this.CurrentIndex].target.findname("WhiteRec")["Fill"]="#ababab";
		        this.MainImage.Source=this.PhotoItems[this.CurrentIndex].photoUrl;
		        
		        var tmp=((this.CurrentIndex+1) * (this.ItemWidth + 5)); // Calculate items "Right" value

		        if(tmp > this.PictureSelect.Width - this.NewLeftValue)
		        {
                    var tmp1=this.NewLeftValue;
                    this.NewLeftValue=(tmp - this.PictureSelect.Width) * -1;
		            this.scrollIntoView.stop();
		            this.scrollIntoView.findname("XFrom").value = tmp1;
		            this.scrollIntoView.findname("XTo").value = this.NewLeftValue;
		            this.scrollIntoView.begin();

		        }
            }
		}

    },


	// Resizes the XAML scene to fill the browser
	resize: function(sender, eventArgs) {

		var sourceWidth = sender.findName("root").width;
		var targetWidth = this.control.content.actualWidth;
		var sourceHeight = sender.findName("root").height;
		var targetHeight = this.control.content.actualHeight;
		   
		var scaleX = 0;
		var scaleY = 0;
		if (sourceHeight > 0 && sourceWidth > 0) {
			scaleX = targetWidth / sourceWidth;
			scaleY = targetHeight / sourceHeight;
		}
		   
		var scaleTransform = sender.findName("scaleTransform");
		scaleTransform.scaleX = scaleX;
		scaleTransform.scaleY = scaleY ;
	},
	
	
	handleLoad: function(control, userContext, rootElement) 
	{
		this.control = control;
		this.PictureSelect = rootElement.findname("PictureSelect");
		this.PictureSelectScroll = this.PictureSelect.findname("PictureSelectScroll");
		this.MainImage = rootElement.findname("MainImage");
		this.Showing=false;
		
		rootElement.findname("FullScreen").addEventListener("MouseLeftButtonDown", BinaryJamSFSPart.createDelegate(this, this.handleMouseDown));

		// Hook the plug-in's resize event
		this.control.content.onResize= BinaryJamSFSPart.createDelegate(this, this.resize) ;
		// Hook the plug-in's resize event
		this.control.content.onFullScreenChange=BinaryJamSFSPart.createDelegate(this, this.resize) ;

		this.resize(rootElement, null);
		
		
	    this.downloader = this.control.createObject("downloader");
        this.downloader.addEventListener("completed", BinaryJamSFSPart.createDelegate(this, this.downloadCompleted) );
        this.downloader.open('GET', this.ClassResourcePath + "/PhotoItem.xaml");
        this.downloader.send();
        
        rootElement.findname("ScrollPicturesLeft").addEventListener("MouseEnter", BinaryJamSFSPart.createDelegate(this, this.handleScrollPicturesLeftOn));
        rootElement.findname("ScrollPicturesLeft").addEventListener("MouseLeave", BinaryJamSFSPart.createDelegate(this, this.handleScrollPicturesLeftOff));
        
        rootElement.findname("ScrollPicturesRight").addEventListener("MouseEnter", BinaryJamSFSPart.createDelegate(this, this.handleScrollPicturesRightOn));
        rootElement.findname("ScrollPicturesRight").addEventListener("MouseLeave", BinaryJamSFSPart.createDelegate(this, this.handleScrollPicturesRightOff));
     
     	rootElement.findname("CanvasMouseOver").addEventListener("MouseEnter", BinaryJamSFSPart.createDelegate(this, this.handleSliderShow));
		rootElement.findname("CanvasMouseOut").addEventListener("MouseEnter", BinaryJamSFSPart.createDelegate(this, this.handleSliderHide));
		
		rootElement.addEventListener("KeyUp", BinaryJamSFSPart.createDelegate(this, this.onKeyUp));

     
		this.scrollTimer = rootElement.findName("timer");
		this.ShowSlider =  rootElement.findName("ShowSlider");
		this.HideSlider =  rootElement.findName("HideSlider");
		this.scrollTimer.addEventListener("completed", BinaryJamSFSPart.createDelegate(this, this.scrollTimerCompleted) );
        this.scrollIntoView = rootElement.findName("ScrollIntoView");
        
	}	
}



BinaryJamSFSPart.Scene.prototype.downloadCompleted = function(sender, eventArgs) 
{
    
    var photoItem;
    var delegate=BinaryJamSFSPart.createDelegate(this, this.onPhotoItemClicked)
    for (var i =0; i< this.PhotoItemsUrls.length; i++)
    {
        // Fill out the template and create a Silverlight element
        photoItem=new BinaryJamSFSPartPhotoItem(this.control, sender.responseText, i , delegate, this.PhotoItemsUrls[i] );
        this.PictureSelectScroll.children.add(photoItem.target);
        this.PhotoItems.push(photoItem);
        
    }

	if (this.PhotoItemsUrls.length>0)
	{
		this.MainImage.Source=this.PhotoItems[0].photoUrl;
		this.PictureSelectScroll.Width = ((5 + photoItem.target.Width) * (this.PhotoItemsUrls.length)) + 5;
    }
    
    if (this.PhotoItemsUrls.length>0) 
    {
		this.ItemWidth=this.PhotoItems[0].Width;
        var photoItemInstance=this.PhotoItems[0].target;
        this.MainImage.Source=this.PhotoItems[0].photoUrl;
        photoItemInstance.findname("WhiteRec")["Fill"]="#ABABAB"; 
        this.CurrentIndex=0;
        this.PictureSelectScroll.Width = ((5 + photoItemInstance.Width) * (this.PhotoItems.length)) + 5;
    }  
}

function BinaryJamSFSPartPhotoUrls(photoUrl, thumbnailUrl) {
    this.photoUrl = photoUrl;
    this.thumbnailUrl = thumbnailUrl;
}

function BinaryJamSFSPartPhotoItem(control, xamlText, index, clickHandler, photoItem) {
    
    var templateInstance = control.content.createFromXaml(xamlText, true);
	
	this.Width = templateInstance.Width;
	this.target = templateInstance;
	this.index = index;
	this.clickHandler = clickHandler;
	this.photoUrl=photoItem.photoUrl;
	this.thumbnailUrl=photoItem.thumbnailUrl
	this.bigImageSource=null;
	this.okToClick=false;
    // Position the item in items canvas
    this.target["Canvas.Left"] = ((index+1) * (this.target.Width + 5)) - this.target.Width;
    this.target["Canvas.Top"] = 5;
    this.target.addEventListener("MouseLeftButtonDown", BinaryJamSFSPart.createDelegate(this, this.handleMouseLeftButtonDown));
    this.target.findName("Image").Source=this.thumbnailUrl; 
    
    this.target.addEventListener("MouseEnter", BinaryJamSFSPart.createDelegate(this, this.handleMouseEnter));
    this.target.addEventListener("MouseLeave", BinaryJamSFSPart.createDelegate(this, this.handleMouseLeave));

    return this;
}

BinaryJamSFSPartPhotoItem.prototype.handleMouseEnter = function(sender, eventArgs) {

    this.target.findName("ZoomIn").begin();
    

}

BinaryJamSFSPartPhotoItem.prototype.handleMouseLeave = function(sender, eventArgs) {

	this.target.findName("ZoomOut").begin();
    
}

BinaryJamSFSPartPhotoItem.prototype.handleMouseLeftButtonDown = function(sender, eventArgs) {

    this.clickHandler(sender, this.photoUrl, this.index);

}


