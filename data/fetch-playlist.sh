yt-dlp -J "https://www.youtube.com/playlist?list=PL-vdFSGRtlOV0vrdnVBAKnGs-nxaFwFaR" > playlist.json

jq '{
  playlist: {
    title: .title,
    description: .description,
    channel: .uploader,
    thumbnail: (
      .thumbnails[0].url
      // ("https://i.ytimg.com/vi/" + .entries[0].id + "/hqdefault.jpg")
    )
  },
  videos: (
    .entries | map({
      id: .id,
      title: .title,
      url: .webpage_url,
      thumbnail: .thumbnail,  
      published: (.timestamp | strftime("%Y-%m-%d"))
    })
  )
}' playlist.json > output.json
