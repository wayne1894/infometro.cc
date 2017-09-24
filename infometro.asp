<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>
<%
Call Response.AddHeader("Access-Control-Allow-Origin", "*")


if instr(Request.ServerVariables("HTTP_REFERER"),"//localhost:1313")=0 and instr(Request.ServerVariables("HTTP_REFERER"),"//infometro.cc")=0 then
    response.end()
end if

url=request("url")


Function getBBstatus(url)
  Dim xmlhttp
  Set xmlhttp = Server.CreateObject("MSXML2.ServerXMLHTTP")
  xmlhttp.setTimeouts 10000,10000,10000,30000
  xmlhttp.Open "GET", url, false
  On Error Resume Next
  xmlhttp.Send
  If Err.Number Then
    getBBstatus = ""
    Err.Clear
  Else
    getBBstatus = split(xmlhttp.ResponseText,"<body")(0)&"</html>"
  End If
  On Error Goto 0
  Set xmlhttp = nothing
End Function
%>
<%=getBBstatus(url)%>