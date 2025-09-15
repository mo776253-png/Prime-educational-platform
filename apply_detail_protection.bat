@echo off
echo Applying ultra-aggressive inspection protection to all detail pages...

REM Apply protection to detail2.html through detail6.html
for %%i in (detail2.html detail3.html detail4.html detail5.html detail6.html) do (
    echo Processing %%i...
    
    REM Add the ultra-aggressive protection script to each detail page
    powershell -Command "
    $content = Get-Content '%%i' -Raw
    $protectionScript = @'
    
    <!-- ULTRA-AGGRESSIVE INSPECTION PROTECTION SCRIPT -->
    <script>
    (function() {
        'use strict';
        
        // Block page completely when inspection detected
        function blockPage() {
            console.clear();
            document.body.innerHTML = '<div style=\"position:fixed;top:0;left:0;width:100%;height:100%;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;z-index:99999;font-family:Arial,sans-serif;\"><div style=\"text-align:center;\"><h1 style=\"color:#ff0000;margin-bottom:20px;\">ACCESS DENIED</h1><p style=\"font-size:18px;margin-bottom:10px;\">Inspection detected!</p><p style=\"font-size:16px;color:#ccc;\">This page is protected against all forms of inspection.</p><p style=\"font-size:14px;color:#888;margin-top:20px;\">Please close any developer tools and refresh the page.</p></div></div>';
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        }
        
        // Block right-click context menu
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            blockPage();
            return false;
        });
        
        // Block ALL keyboard shortcuts that could be used for inspection
        document.addEventListener('keydown', function(e) {
            // F12 key
            if (e.keyCode === 123) {
                e.preventDefault();
                blockPage();
                return false;
            }
            // Ctrl+Shift+I (Developer Tools)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
                e.preventDefault();
                blockPage();
                return false;
            }
            // Ctrl+Shift+J (Console)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
                e.preventDefault();
                blockPage();
                return false;
            }
            // Ctrl+Shift+C (Element Inspector)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
                e.preventDefault();
                blockPage();
                return false;
            }
            // Ctrl+U (View Source)
            if (e.ctrlKey && e.keyCode === 85) {
                e.preventDefault();
                blockPage();
                return false;
            }
            // Ctrl+S (Save Page)
            if (e.ctrlKey && e.keyCode === 83) {
                e.preventDefault();
                blockPage();
                return false;
            }
            // Ctrl+A (Select All)
            if (e.ctrlKey && e.keyCode === 65) {
                e.preventDefault();
                blockPage();
                return false;
            }
            // Ctrl+Shift+K (Firefox Console)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 75) {
                e.preventDefault();
                blockPage();
                return false;
            }
            // Ctrl+Shift+E (Firefox Network)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 69) {
                e.preventDefault();
                blockPage();
                return false;
            }
            // Block all F-keys
            if (e.keyCode >= 112 && e.keyCode <= 123) {
                e.preventDefault();
                blockPage();
                return false;
            }
            // Block all Ctrl+Shift combinations
            if (e.ctrlKey && e.shiftKey) {
                e.preventDefault();
                blockPage();
                return false;
            }
            // Block Ctrl+P (Print)
            if (e.ctrlKey && e.keyCode === 80) {
                e.preventDefault();
                blockPage();
                return false;
            }
        });
        
        // Disable text selection
        document.addEventListener('selectstart', function(e) {
            e.preventDefault();
            blockPage();
            return false;
        });
        
        // Disable drag and drop
        document.addEventListener('dragstart', function(e) {
            e.preventDefault();
            blockPage();
            return false;
        });
        
        // Block copy, cut, paste
        document.addEventListener('copy', function(e) {
            e.preventDefault();
            blockPage();
            return false;
        });
        
        document.addEventListener('cut', function(e) {
            e.preventDefault();
            blockPage();
            return false;
        });
        
        document.addEventListener('paste', function(e) {
            e.preventDefault();
            blockPage();
            return false;
        });
        
        // Block print
        window.addEventListener('beforeprint', function(e) {
            e.preventDefault();
            blockPage();
            return false;
        });
        
        // Block common inspection methods
        (function() {
            // Override console methods
            var noop = function() { blockPage(); };
            var methods = ['log', 'debug', 'info', 'warn', 'error', 'trace', 'dir', 'group', 'groupEnd', 'time', 'timeEnd', 'count', 'clear', 'table'];
            methods.forEach(function(method) {
                console[method] = noop;
            });
            
            // Block common inspection properties
            Object.defineProperty(window, 'console', {
                get: function() {
                    blockPage();
                    return {
                        log: noop,
                        debug: noop,
                        info: noop,
                        warn: noop,
                        error: noop,
                        trace: noop,
                        dir: noop,
                        group: noop,
                        groupEnd: noop,
                        time: noop,
                        timeEnd: noop,
                        count: noop,
                        clear: noop,
                        table: noop
                    };
                },
                set: function() { blockPage(); }
            });
        })();
        
        // Detect and block developer tools
        var devtools = {
            open: false,
            orientation: null,
            threshold: 160
        };
        
        // Multiple detection methods
        function detectDevTools() {
            var widthThreshold = window.outerWidth - window.innerWidth > devtools.threshold;
            var heightThreshold = window.outerHeight - window.innerHeight > devtools.threshold;
            var orientation = widthThreshold ? 'vertical' : 'horizontal';
            
            if (widthThreshold || heightThreshold) {
                if (!devtools.open) {
                    devtools.open = true;
                    devtools.orientation = orientation;
                    blockPage();
                }
            } else {
                devtools.open = false;
            }
        }
        
        // Run detection every 100ms for faster response
        setInterval(detectDevTools, 100);
        
        // Additional detection using console.log override
        var devtoolsOpen = false;
        var element = new Image();
        Object.defineProperty(element, 'id', {
            get: function() {
                devtoolsOpen = true;
                blockPage();
                throw new Error('DevTools detected');
            }
        });
        
        // Console detection
        var devtoolsDetected = false;
        setInterval(function() {
            if (devtoolsDetected) return;
            
            var before = new Date();
            debugger;
            var after = new Date();
            
            if (after - before > 100) {
                devtoolsDetected = true;
                blockPage();
            }
        }, 1000);
        
        // Block eval and Function
        window.eval = function() {
            blockPage();
            throw new Error('Code execution blocked');
        };
        
        window.Function = function() {
            blockPage();
            throw new Error('Function creation blocked');
        };
        
        // Block common debugging properties
        (function() {
            var blockedProps = ['debugger', 'console', 'eval', 'Function'];
            blockedProps.forEach(function(prop) {
                try {
                    Object.defineProperty(window, prop, {
                        get: function() { blockPage(); return undefined; },
                        set: function() { blockPage(); }
                    });
                } catch(e) {}
            });
        })();
        
        // Block source code access via URL
        if (window.location.href.includes('view-source:') || window.location.href.includes('chrome://') || window.location.href.includes('about:')) {
            blockPage();
        }
        
        // Block common inspection URLs
        var blockedUrls = ['view-source:', 'chrome://', 'about:', 'moz-extension:', 'chrome-extension:'];
        blockedUrls.forEach(function(url) {
            if (window.location.href.includes(url)) {
                blockPage();
            }
        });
        
        // ULTRA-AGGRESSIVE CONTINUOUS PROTECTION
        (function() {
            // Multiple protection intervals that cannot be disabled
            setInterval(function() {
                // Re-apply all protection methods continuously
                document.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    blockPage();
                    return false;
                });
                
                document.addEventListener('keydown', function(e) {
                    if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey) || (e.ctrlKey && e.keyCode === 85) || (e.ctrlKey && e.keyCode === 83) || (e.ctrlKey && e.keyCode === 65) || (e.ctrlKey && e.keyCode === 80)) {
                        e.preventDefault();
                        blockPage();
                        return false;
                    }
                });
                
                document.addEventListener('selectstart', function(e) {
                    e.preventDefault();
                    blockPage();
                    return false;
                });
                
                document.addEventListener('dragstart', function(e) {
                    e.preventDefault();
                    blockPage();
                    return false;
                });
                
                // Re-block console access
                var noop = function() { blockPage(); };
                var methods = ['log', 'debug', 'info', 'warn', 'error', 'trace', 'dir', 'group', 'groupEnd', 'time', 'timeEnd', 'count', 'clear', 'table'];
                methods.forEach(function(method) {
                    try {
                        console[method] = noop;
                    } catch(e) {}
                });
                
            }, 100); // Run every 100ms for maximum protection
            
            // Additional protection that runs every 50ms
            setInterval(function() {
                // Block all F-keys
                document.addEventListener('keydown', function(e) {
                    if (e.keyCode >= 112 && e.keyCode <= 123) {
                        e.preventDefault();
                        blockPage();
                        return false;
                    }
                });
                
                // Block all Ctrl+Shift combinations
                document.addEventListener('keydown', function(e) {
                    if (e.ctrlKey && e.shiftKey) {
                        e.preventDefault();
                        blockPage();
                        return false;
                    }
                });
                
                // Block right-click
                document.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    blockPage();
                    return false;
                });
                
            }, 50); // Run every 50ms
            
            // Third protection layer that runs every 200ms
            setInterval(function() {
                // Re-apply console blocking
                try {
                    Object.defineProperty(window, 'console', {
                        get: function() { blockPage(); return {}; },
                        set: function() { blockPage(); }
                    });
                } catch(e) {}
                
                // Block eval and Function
                try {
                    window.eval = function() { blockPage(); throw new Error('Code execution blocked'); };
                    window.Function = function() { blockPage(); throw new Error('Function creation blocked'); };
                } catch(e) {}
                
            }, 200); // Run every 200ms
            
        })();
        
        // Add warning message to console
        setTimeout(function() {
            console.clear();
            console.log('%cSTOP!', 'color: red; font-size: 50px; font-weight: bold;');
            console.log('%cThis is a browser feature intended for developers. If someone told you to copy-paste something here, it is a scam and will give them access to your account.', 'color: red; font-size: 16px;');
            console.log('%cDo not paste any code here that you do not understand.', 'color: red; font-size: 16px;');
        }, 1000);
        
    })();
    </script>
'@
    
    # Find the position to insert the script (after CryptoJS script)
    $insertPos = $content.IndexOf('</head>')
    if ($insertPos -gt 0) {
        $newContent = $content.Insert($insertPos, $protectionScript)
        Set-Content '%%i' -Value $newContent -Encoding UTF8
        Write-Host 'Protection added to %%i'
    } else {
        Write-Host 'Could not find insertion point in %%i'
    }
    "
)

echo Protection applied to all detail pages!
pause
