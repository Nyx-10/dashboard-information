Add-Type -AssemblyName System.Runtime.WindowsRuntime
[Windows.Media.Transcoding.MediaTranscoder, Windows.Media.Transcoding, ContentType = WindowsRuntime] | Out-Null
[Windows.Media.MediaProperties.MediaEncodingProfile, Windows.Media.MediaProperties, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.StorageFolder, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.CreationCollisionOption, Windows.Storage, ContentType = WindowsRuntime] | Out-Null

$asTaskGeneric = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.IsGenericMethod } | Select-Object -First 1

function Await-Op($op, $type) {
    $method = $asTaskGeneric.MakeGenericMethod($type)
    $task = $method.Invoke($null, @($op))
    $task.Wait()
    return $task.Result
}

$inputPath = "C:\Users\User\Downloads\Video Citec 2025.MP4"
$opIn = [Windows.Storage.StorageFile]::GetFileFromPathAsync($inputPath)
$fileIn = Await-Op $opIn ([Windows.Storage.StorageFile])

$opFolder = [Windows.Storage.StorageFolder]::GetFolderFromPathAsync("C:\Users\User\Downloads")
$folder = Await-Op $opFolder ([Windows.Storage.StorageFolder])

$opOut = $folder.CreateFileAsync("citec_audio.mp3", [Windows.Storage.CreationCollisionOption]::ReplaceExisting)
$fileOut = Await-Op $opOut ([Windows.Storage.StorageFile])

$profile = [Windows.Media.MediaProperties.MediaEncodingProfile]::CreateMp3([Windows.Media.MediaProperties.AudioEncodingQuality]::Medium)
$transcoder = New-Object Windows.Media.Transcoding.MediaTranscoder
$transcoder.TrimStartTime = [System.TimeSpan]::FromSeconds(0)
$transcoder.TrimStopTime = [System.TimeSpan]::FromSeconds(90)

$opPrep = $transcoder.PrepareFileTranscodeAsync($fileIn, $fileOut, $profile)
$prepared = Await-Op $opPrep ([Windows.Media.Transcoding.PrepareTranscodeResult])

if ($prepared.CanTranscode) {
    Write-Output "Transcoding..."
    $opAction = $prepared.TranscodeAsync()
    $asTaskAction = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and -not $_.IsGenericMethod } | Select-Object -First 1
    $taskAction = $asTaskAction.Invoke($null, @($opAction))
    $taskAction.Wait()
    Write-Output "Transcode completed!"
} else {
    Write-Output "Failed: $($prepared.FailureReason)"
}
