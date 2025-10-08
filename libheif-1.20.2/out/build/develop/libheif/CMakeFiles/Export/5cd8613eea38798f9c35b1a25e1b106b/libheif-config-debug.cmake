#----------------------------------------------------------------
# Generated CMake target import file for configuration "Debug".
#----------------------------------------------------------------

# Commands may need to know the format version.
set(CMAKE_IMPORT_FILE_VERSION 1)

# Import target "heif" for configuration "Debug"
set_property(TARGET heif APPEND PROPERTY IMPORTED_CONFIGURATIONS DEBUG)
set_target_properties(heif PROPERTIES
  IMPORTED_IMPLIB_DEBUG "${_IMPORT_PREFIX}/lib/heif.lib"
  IMPORTED_LOCATION_DEBUG "${_IMPORT_PREFIX}/bin/heif.dll"
  )

list(APPEND _cmake_import_check_targets heif )
list(APPEND _cmake_import_check_files_for_heif "${_IMPORT_PREFIX}/lib/heif.lib" "${_IMPORT_PREFIX}/bin/heif.dll" )

# Commands beyond this point should not need to know the version.
set(CMAKE_IMPORT_FILE_VERSION)
