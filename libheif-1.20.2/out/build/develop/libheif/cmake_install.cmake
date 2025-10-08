# Install script for directory: C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/libheif

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "C:/Program Files (x86)/libheif")
endif()
string(REGEX REPLACE "/$" "" CMAKE_INSTALL_PREFIX "${CMAKE_INSTALL_PREFIX}")

# Set the install configuration name.
if(NOT DEFINED CMAKE_INSTALL_CONFIG_NAME)
  if(BUILD_TYPE)
    string(REGEX REPLACE "^[^A-Za-z0-9_]+" ""
           CMAKE_INSTALL_CONFIG_NAME "${BUILD_TYPE}")
  else()
    set(CMAKE_INSTALL_CONFIG_NAME "Release")
  endif()
  message(STATUS "Install configuration: \"${CMAKE_INSTALL_CONFIG_NAME}\"")
endif()

# Set the component getting installed.
if(NOT CMAKE_INSTALL_COMPONENT)
  if(COMPONENT)
    message(STATUS "Install component: \"${COMPONENT}\"")
    set(CMAKE_INSTALL_COMPONENT "${COMPONENT}")
  else()
    set(CMAKE_INSTALL_COMPONENT)
  endif()
endif()

# Is this installation the result of a crosscompile?
if(NOT DEFINED CMAKE_CROSSCOMPILING)
  set(CMAKE_CROSSCOMPILING "FALSE")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for the subdirectory.
  include("C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/out/build/develop/libheif/plugins/cmake_install.cmake")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY OPTIONAL FILES "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/out/build/develop/libheif/Debug/heif.lib")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY OPTIONAL FILES "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/out/build/develop/libheif/Release/heif.lib")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY OPTIONAL FILES "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/out/build/develop/libheif/MinSizeRel/heif.lib")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY OPTIONAL FILES "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/out/build/develop/libheif/RelWithDebInfo/heif.lib")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE SHARED_LIBRARY FILES "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/out/build/develop/libheif/Debug/heif.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE SHARED_LIBRARY FILES "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/out/build/develop/libheif/Release/heif.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE SHARED_LIBRARY FILES "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/out/build/develop/libheif/MinSizeRel/heif.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE SHARED_LIBRARY FILES "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/out/build/develop/libheif/RelWithDebInfo/heif.dll")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/libheif" TYPE FILE FILES
    "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/libheif/api/libheif/heif.h"
    "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/libheif/api/libheif/heif_library.h"
    "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/libheif/api/libheif/heif_image.h"
    "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/libheif/api/libheif/heif_color.h"
    "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/libheif/api/libheif/heif_error.h"
    "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/libheif/api/libheif/heif_plugin.h"
    "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/libheif/api/libheif/heif_properties.h"
    "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/libheif/api/libheif/heif_regions.h"
    "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/libheif/api/libheif/heif_items.h"
    "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/libheif/api/libheif/heif_sequences.h"
    "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/libheif/api/libheif/heif_tai_timestamps.h"
    "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/libheif/api/libheif/heif_brands.h"
    "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/libheif/api/libheif/heif_metadata.h"
    "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/libheif/api/libheif/heif_aux_images.h"
    "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/libheif/api/libheif/heif_entity_groups.h"
    "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/libheif/api/libheif/heif_security.h"
    "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/libheif/api/libheif/heif_encoding.h"
    "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/libheif/api/libheif/heif_decoding.h"
    "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/libheif/api/libheif/heif_image_handle.h"
    "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/libheif/api/libheif/heif_context.h"
    "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/libheif/api/libheif/heif_tiling.h"
    "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/libheif/api/libheif/heif_uncompressed.h"
    "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/libheif/api/libheif/heif_cxx.h"
    "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/out/build/develop/libheif/heif_version.h"
    "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/libheif/api/libheif/heif_experimental.h"
    )
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  if(EXISTS "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/cmake/libheif/libheif-config.cmake")
    file(DIFFERENT _cmake_export_file_changed FILES
         "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/cmake/libheif/libheif-config.cmake"
         "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/out/build/develop/libheif/CMakeFiles/Export/5cd8613eea38798f9c35b1a25e1b106b/libheif-config.cmake")
    if(_cmake_export_file_changed)
      file(GLOB _cmake_old_config_files "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/cmake/libheif/libheif-config-*.cmake")
      if(_cmake_old_config_files)
        string(REPLACE ";" ", " _cmake_old_config_files_text "${_cmake_old_config_files}")
        message(STATUS "Old export file \"$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/cmake/libheif/libheif-config.cmake\" will be replaced.  Removing files [${_cmake_old_config_files_text}].")
        unset(_cmake_old_config_files_text)
        file(REMOVE ${_cmake_old_config_files})
      endif()
      unset(_cmake_old_config_files)
    endif()
    unset(_cmake_export_file_changed)
  endif()
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/cmake/libheif" TYPE FILE FILES "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/out/build/develop/libheif/CMakeFiles/Export/5cd8613eea38798f9c35b1a25e1b106b/libheif-config.cmake")
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/cmake/libheif" TYPE FILE FILES "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/out/build/develop/libheif/CMakeFiles/Export/5cd8613eea38798f9c35b1a25e1b106b/libheif-config-debug.cmake")
  endif()
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/cmake/libheif" TYPE FILE FILES "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/out/build/develop/libheif/CMakeFiles/Export/5cd8613eea38798f9c35b1a25e1b106b/libheif-config-minsizerel.cmake")
  endif()
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/cmake/libheif" TYPE FILE FILES "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/out/build/develop/libheif/CMakeFiles/Export/5cd8613eea38798f9c35b1a25e1b106b/libheif-config-relwithdebinfo.cmake")
  endif()
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/cmake/libheif" TYPE FILE FILES "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/out/build/develop/libheif/CMakeFiles/Export/5cd8613eea38798f9c35b1a25e1b106b/libheif-config-release.cmake")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/cmake/libheif" TYPE FILE FILES "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/out/build/develop/libheif/libheif-config-version.cmake")
endif()

string(REPLACE ";" "\n" CMAKE_INSTALL_MANIFEST_CONTENT
       "${CMAKE_INSTALL_MANIFEST_FILES}")
if(CMAKE_INSTALL_LOCAL_ONLY)
  file(WRITE "C:/Users/ntc/Desktop/imageconvert_pro/libheif-1.20.2/out/build/develop/libheif/install_local_manifest.txt"
     "${CMAKE_INSTALL_MANIFEST_CONTENT}")
endif()
