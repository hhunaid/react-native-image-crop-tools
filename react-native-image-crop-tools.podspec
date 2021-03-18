require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-image-crop-tools"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-image-crop-tools
                   DESC
  s.homepage     = "https://github.com/hiblocks/react-native-image-crop-tools-v2"
  s.license      = "MIT"
  s.authors      = { "hiblocks" => "hiblocks.co@gmail.com" }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://github.com/hiblocks/react-native-image-crop-tools-v2.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m}"
  s.requires_arc = true

  s.dependency "React"
  s.dependency 'TOCropViewController', '2.5.3'
end

