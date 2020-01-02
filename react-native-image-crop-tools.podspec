require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-image-crop-tools"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-image-crop-tools
                   DESC
  s.homepage     = "https://github.com/hhunaid/react-native-image-crop-tools"
  s.license      = "MIT"
  s.authors      = { "Hunaid Hassan" => "hhunaid@gmail.com" }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://github.com/hhunaid/react-native-image-crop-tools.git", :tag => "#{s.version}" }

  s.public_header_files = "ios/**/*.h"
  s.resource_bundles = { 'CropViewController' =>'ios/CropViewController/*.png' }
  s.source_files = "ios/**/*.{h,m,swift}"
  s.requires_arc = true

  s.dependency "React"
end

