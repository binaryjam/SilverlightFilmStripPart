
using System.Web.UI.WebControls.WebParts;
using System;
using System.ComponentModel;
using Microsoft.SharePoint;
using System.Web.UI;
using System.IO;
using System.Globalization;
using System.Text;

namespace BinaryJam.SilverLightParts
{

    public class FilmStripPart : System.Web.UI.WebControls.WebParts.WebPart
	{
	
		private const string defaultText = "";
		
		private const string defaultListName = "";
		private string listName = defaultListName;

		//Constructor
		public FilmStripPart()
		{
			this.PreRender+=new EventHandler(Part_PreRender);


		}

        [WebBrowsable(true),
            Category("Configuration"),
            Personalizable(PersonalizationScope.User),
            DefaultValue(""),
            WebDisplayName("ListName"),
            WebDescription("Name of an images list in this web")]
        public string ListName
        {
            get
            {
                return listName;
            }

            set
            {
                listName = value;
            }
        }

 
      
		string _controlWidth = "";
        [WebBrowsable(true),
        Category("Configuration"),
        Personalizable(PersonalizationScope.Shared),
        DefaultValue(""),
        WebDisplayName("Control Width"),
        WebDescription("Overrides the width of the Silverlight control")]
        public string ControlWidth
        {
            get
            {
                return _controlWidth;
            }

            set
            {
                _controlWidth = value;
            }
        }

		string _controlHeight = "";
        [WebBrowsable(true),
        Category("Configuration"),
        Personalizable(PersonalizationScope.Shared),
        DefaultValue(""),
        WebDisplayName("Control Height"),
        WebDescription("Overrides the height of the Silverlight control")]
        public string ControlHeight
        {
            get
            {
                return _controlHeight;
            }

            set
            {
                _controlHeight = value;
            }
        }

		protected override void CreateChildControls()
		{
	
				
		
		}

		private void Part_PreRender(object sender, EventArgs e)
		{
			EnsureChildControls();
			StringBuilder sb;

			sb = new StringBuilder("");

			//For some reason if the main.js comes before the others then it stops working,
			//by registering it first it comes out last, must be a lifo queue

			// Register the webpart specfic script (Each different type of webpart needs its own main, multiple instances of the same webpart on a page reference the same script
			sb.Append("<script type=\"text/javascript\" src=\"" + SPContext.Current.Web.ServerRelativeUrl + "/Files" + "/Main.js\"></script>\n");
			if (!Page.IsClientScriptBlockRegistered("BinaryJam.SilverLightPartsScript"))
				Page.RegisterClientScriptBlock("BinaryJam.SilverLightPartsScript", sb.ToString());

			// Register the general scripts (Two web parts can use this same script blocks as they are generic)
			sb = new StringBuilder("");
            sb.Append("<script type=\"text/javascript\" src=\"" + SPContext.Current.Web.ServerRelativeUrl + "/Files" + "/Silverlight.js\"></script>\n");
            sb.Append("<script type=\"text/javascript\" src=\"" + SPContext.Current.Web.ServerRelativeUrl + "/Files" + "/CreateSilverlight.js\"></script>\n");
			if (!Page.IsClientScriptBlockRegistered("GeneralSilverlightScripts"))
				Page.RegisterClientScriptBlock("GeneralSilverlightScripts", sb.ToString());

		}


		protected override void RenderContents(HtmlTextWriter output)
		{
			EnsureChildControls();
			
			HtmlTextWriter textWriter = new HtmlTextWriter(new StringWriter(CultureInfo.InvariantCulture));

			try 
			{
				string width, height;

				width="400px";height="300px";
                if (ControlWidth.Length > 0)
                    width = ControlWidth + "px";

                if (ControlHeight.Length > 0)
                    height = ControlHeight + "px";


                SPWeb myWeb = SPContext.Current.Web;

				int i=0;
				textWriter.WriteLine ("<TABLE class='ms-summarycustombody' cellpadding='0' cellspacing='0' border='0'>");
				textWriter.WriteLine ("<tr><td width='95%'>");

				if (ListName.Length == 0)
				{
					textWriter.WriteLine("<TR><TD>A Sharepoint Image Library List is not currently selected.</TD></TR>");
				}
				else
				{
                    if (myWeb.Lists[ListName].Items.Count == 0)
					{
						textWriter.WriteLine("<TR><TD>There are no images in the Image Library, please add some.</TD></TR>");
					}
					else
					{
						textWriter.WriteLine ("<div id='SilverlightControlHost" + this.ClientID  + "'>");
						textWriter.WriteLine ("<script type=\"text/javascript\"> ");
                        textWriter.WriteLine("var localScene=new BinaryJamSFSPart.Scene('SilverlightControlHost" + this.ClientID + "', '" + SPContext.Current.Web.ServerRelativeUrl + "/Files" + "'); ");
                        textWriter.WriteLine("createSilverlight('SilverlightControlHost" + this.ClientID + "', '" + SPContext.Current.Web.ServerRelativeUrl + "/Files" + "/Scene.xaml', 'SilverlightControl" + this.ClientID + "','" + width + "','" + height + "', localScene);  ");

                        foreach (SPListItem item in myWeb.Lists[ListName].Items)
						{
							textWriter.WriteLine("localScene.PhotoItemsUrls['" + i.ToString() + "'] =  new BinaryJamSFSPartPhotoUrls('" + item["EncodedAbsWebImgUrl"].ToString() + "','" + item["EncodedAbsThumbnailUrl"].ToString() + "') ;");
							i++;
						}

						textWriter.WriteLine ("</script></div>");
					}
				}
				textWriter.WriteLine ("</td></tr></TABLE>");
			}
			catch //Slacker
			{
				textWriter = new HtmlTextWriter(new StringWriter(CultureInfo.InvariantCulture));
				textWriter.WriteLine("<TABLE class='ms-summarycustombody' cellpadding='0' cellspacing='0' border='0'>");
				textWriter.WriteLine("<TR><TD>There was an error creating this web part</TD></TR>");
				textWriter.WriteLine("</TABLE>");
			}
			
			output.Write( textWriter.InnerWriter.ToString() );

		}

	}
}
	