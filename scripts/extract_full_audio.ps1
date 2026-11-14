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
$fileIn = Await-Op ([Windows.Storage.StorageFile]::GetFileFromPathAsync($inputPath)) ([Windows.Storage.StorageFile])

$folder = Await-Op ([Windows.Storage.StorageFolder]::GetFolderFromPathAsync("C:\Users\User\Downloads")) ([Windows.Storage.StorageFolder])
$fileOut = Await-Op ($folder.CreateFileAsync("citec_audio_full.mp3", [Windows.Storage.CreationCollisionOption]::ReplaceExisting)) ([Windows.Storage.StorageFile])

$profile = [Windows.Media.MediaProperties.MediaEncodingProfile]::CreateMp3([Windows.Media.MediaProperties.AudioEncodingQuality]::Medium)
$transcoder = New-Object Windows.Media.Transcoding.MediaTranscoder

$prepared = Await-Op ($transcoder.PrepareFileTranscodeAsync($fileIn, $fileOut, $profile)) ([Windows.Media.Transcoding.PrepareTranscodeResult])

if ($prepared.CanTranscode) {
    Write-Output "Transcoding entire audio..."
    $action = $prepared.TranscodeAsync()
    
    # Wait until status is no longer Started (0)
    while ($action.Status.value__ -eq 0) {
        Start-Sleep -Milliseconds 200
    }
    Write-Output "Final Status: $($action.Status)"
    if ($action.ErrorCode) {
        Write-Output "Error: $($action.ErrorCode)"
    }
} else {
    Write-Output "Failed: $($prepared.FailureReason)"
}
