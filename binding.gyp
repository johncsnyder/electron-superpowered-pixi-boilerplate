{
    "targets": [
        {
            "target_name": "filter",
            "sources": [ "src/filter.cc" ],
            "include_dirs": [
                "<!(node -e \"require('nan')\")",
                "$(SUPERPOWERED_ROOT)"
            ],
            'conditions': [
                ['OS=="mac"', {
                    "libraries": [ 
                        "$(SUPERPOWERED_ROOT)/libSuperpoweredAudioOSX.a" 
                    ]
                }]
            ]
        }
    ]
}