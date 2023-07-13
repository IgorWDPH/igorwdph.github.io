$From = "wmfvlz49@gmail.com"
$To = "wmfvlz49@gmail.com"
$Subject = "Email subject goes here"
$Body = "Email body goes here"

# The password is an app-specific password if you have 2-factor-auth enabled
$Password = "trumlramsequdrxy" | ConvertTo-SecureString -AsPlainText -Force
$file = "D:\Install\MSIAfterburnerSetup.zip"
$Credential = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $From, $Password
Send-MailMessage -From $From -To $To -Subject $Subject -Body $Body -SmtpServer "smtp.gmail.com" -port 587 -UseSsl -Credential $Credential -Attachments $file