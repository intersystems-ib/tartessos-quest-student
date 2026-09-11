Class Tartessos.Quest.API.BurialTrail Extends %CSP.REST
{

Parameter CHARSET = "utf-8";

Parameter CONTENTTYPE = "application/json";

Parameter HandleCorsRequest = 1;

XData UrlMap [ XMLNamespace = "https://www.intersystems.com/urlmap" ]
{
<Routes>
    <Route Url="/burial-trail" Method="GET" Call="GetBurialTrail"/>
</Routes>
}

ClassMethod GetBurialTrail() As %Status
{
    // Set the response content type to JSON with UTF-8 encoding
    // Get the floorLevel parameter from the request
    // Build the burial trail response based on the floorLevel invoking a helper method to get the response object from a SQL query
    // The method have to return a JSON response with the structure required and save it into the response variable

    Do ##class(Tartessos.Quest.Utils).NextLevel(.response)

    Write response.%ToJSON()

    Return $$$OK
}

}