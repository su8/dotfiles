// sudo chown -R root /usr/lib/firefox/browser/defaults/preferences/vendor.js

// Some of the code was borrowed from https://github.com/pyllyukko/user.js

// Use LANG environment variable to choose locale
pref("intl.locale.matchOS", false);

// Disable default browser checking.
pref("browser.shell.checkDefaultBrowser", false);

// Don't disable our bundled extensions in the application directory
pref("extensions.autoDisableScopes", 11);
pref("extensions.shownSelectionUI", true);

// Added by me
pref("network.cookie.prefsMigrated", true);
pref("network.dns.disableIPv6", true);
pref("network.http.max-persistent-connections-per-proxy", 16);
pref("network.http.max-persistent-connections-per-server", 16);
pref("network.http.pipelining", true);
pref("network.http.pipelining.ssl", true);
pref("network.http.pipelining.maxrequests", 8);
pref("network.http.proxy.pipelining", true);
pref("network.http.redirection-limit", 5);
pref("network.http.fast-fallback-to-IPv4", false);
pref("network.http.accept.default", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
pref("network.http.accept-encoding", "gzip, deflate");
pref("network.prefetch-next", false);
pref("network.negotiate-auth.allow-insecure-ntlm-v1", false);
pref("network.http.sendRefererHeader", 1);
pref("network.http.referer.spoofSource", 1);
pref("network.IDN_show_punycode", true);
pref("network.stricttransportsecurity.preloadlist", true);
pref("security.dialog_enable_delay", 0);
pref("nglayout.initialpaint.delay", 0);
pref("ui.submenuDelay", 0);
//pref("browser.sessionstore.interval", 300000);
pref("browser.sessionstore.enabled", false);
pref("mousewheel.acceleration.start", -1);
pref("mousewheel.acceleration.factor", 10);
pref("network.protocol-handler.expose.magnet", false);
pref("mousewheel.min_line_scroll_amount", 40);
pref("general.smoothScroll", false);
pref("general.smoothScroll.pages", false);
pref("image.mem.min_discard_timeout_ms", 2100000000);
pref("image.mem.max_decoded_image_kb", 512000);
pref("media.peerconnection.enabled", false);
pref("browser.search.showOneOffButtons", false);
pref("browser.cache.disk.enable", false);
pref("browser.cache.disk_cache_ssl", false);
pref("browser.cache.offline.enable", false);
pref("browser.cache.memory.enable", false);
pref("browser.cache.disk.capacity", 0);
pref("browser.cache.disk.smart_size.enabled", false);
pref("browser.cache.disk.smart_size.first_run", false);
pref("browser.cache.offline.capacity", 0);
pref("dom.storage.default_quota", 0);
pref("dom.storage.enabled", false);
pref("dom.indexedDB.enabled", false);
pref("dom.battery.enabled", false);
pref("browser.search.suggest.enabled", false);
pref("browser.sessionstore.resume_from_crash", false);
pref("geo.enabled", false);
pref("keyword.enabled", false);
pref("network.dns.disablePrefetch", true);
pref("network.dns.disablePrefetchFromHTTPS", true);
pref("dom.disable_window_open_feature.menubar", true);
pref("dom.disable_window_open_feature.personalbar", true);
pref("dom.disable_window_open_feature.scrollbars", true);
pref("dom.disable_window_open_feature.toolbar", true);
pref("dom.telephony.enabled", false);
pref("browser.identity.ssl_domain_display", 1);
pref("browser.urlbar.autocomplete.enabled", false);
pref("browser.urlbar.trimURL", false);
pref("browser.urlbar.autoFill", false);
pref("browser.urlbar.autoFill.typed", false);
pref("browser.urlbar.maxRichResults", 0);
pref("privacy.sanitize.sanitizeOnShutdown", true);
pref("privacy.clearOnShutdown.cache", true);
pref("privacy.clearOnShutdown.cookies", true);
pref("privacy.clearOnShutdown.downloads", true);
pref("privacy.clearOnShutdown.formdata", true);
pref("privacy.clearOnShutdown.history", true);
pref("privacy.clearOnShutdown.offlineApps", true);
pref("privacy.clearOnShutdown.passwords", true);
pref("privacy.clearOnShutdown.sessions", true);
pref("privacy.clearOnShutdown.siteSettings", true);
pref("network.http.sendSecureXSiteReferrer", false);
pref("network.http.spdy.enabled", false);
pref("network.http.spdy.enabled.v3", false);
pref("network.http.spdy.enabled.v3-1", false);
pref("plugins.click_to_play", true);
pref("security.enable_tls_session_tickets", false);
pref("security.ssl.enable_false_start", true);
pref("extensions.blocklist.enabled", false);
pref("webgl.disabled", true);
pref("network.websocket.enabled", false);
pref("dom.popup_maximum Mine", 10);
pref("network.prefetch-next", false);
pref("browser.backspace_action", 0);
pref("browser.sessionstore.max_tabs_undo", 5);
pref("browser.sessionhistory.max_entries", 5);
pref("browser.sessionstore.max_windows_undo", 1);
pref("browser.sessionstore.max_resumed_crashes", 0);
pref("browser.sessionhistory.max_total_viewers", 0);
pref("browser.tabs.animate", 0);
pref("general.useragent.override", "Mozilla/5.0 (Windows NT 6.1; rv:31.0) Gecko/20100101 Firefox/31.0");
pref("general.appname.override", "");
pref("general.appversion.override", "");
pref("general.oscpu.override", "");
pref("general.platform.override", "");
pref("general.productSub.override", 1);
pref("general.buildID.override", 1);
pref("general.useragent.vendor", "");
pref("general.useragent.vendorSub", "");
pref("intl.accept_languages", "en-us,en");
pref("intl.accept_charset", "iso-8859-1,*,utf-8");
pref("toolkit.telemetry.enabled", false);
pref("browser.download.useDownloadDir", false);
pref("privacy.trackingprotection.enabled", true);
pref("browser.fixup.alternate.enabled", false);
pref("network.proxy.socks_remote_dns", true);
pref("javascript.options.methodjit.chrome", false);
pref("javascript.options.methodjit.content", false);
pref("pdfjs.disabled", true);
pref("browser.safebrowsing.remoteLookups", false);
pref("datareporting.healthreport.uploadEnabled", false);
pref("plugin.state.flash", 0);
pref("media.navigator.enabled", false);
pref("beacon.enabled", false);
pref("media.webspeech.recognition.enable", false);
pref("media.getusermedia.screensharing.enabled", false);
pref("browser.newtabpage.enhanced", false);
pref("browser.newtab.preload", false);
pref("browser.send_pings", false);
pref("security.mixed_content.block_active_content", true);
pref("security.mixed_content.block_display_content", true);
pref("dom.gamepad.enabled", false);
pref("dom.vr.enabled", false);
pref("network.jar.open-unsafe-types", false);
pref("extensions.blocklist.enabled", true);
pref("security.csp.experimentalEnabled", true);
pref("security.csp.enable", true);
pref("privacy.donottrackheader.enabled", true);
pref("browser.sessionstore.postdata", 0);
pref("browser.privatebrowsing.autostart", true);
pref("places.history.enabled", false);
pref("network.cookie.lifetimePolicy", 2);
pref("signon.rememberSignons", false);
pref("browser.history_expire_days", 0);
pref("browser.history_expire_sites", 0);
pref("browser.history_expire_visits", 0);
pref("browser.download.manager.retention", 0);
pref("browser.formfill.enable", false);
pref("browser.formfill.expire_days", 0);
pref("browser.sessionstore.privacy_level", 2);
pref("browser.newtabpage.enabled", false);
pref("plugins.update.notifyUser", true);
pref("plugins.hide_infobar_for_outdated_plugin", false);
pref("security.warn_viewing_mixed", true);
pref("security.warn_entering_weak", true);
pref("layout.css.visited_links_enabled", false);
pref("signon.autofillForms", false);
pref("security.ssl.warn_missing_rfc5746", 1);
pref("security.ask_for_password", 0);
pref("security.OCSP.enabled", true);
pref("security.ssl.enable_ocsp_stapling", true);
pref("security.tls.version.min", 1);
pref("security.tls.version.max", 3);
pref("browser.urlbar.filter.javascript", true);
pref("browser.safebrowsing.malware.enabled", false);
pref("browser.safebrowsing.enabled", false);
pref("browser.download.folderList", 2);
pref("network.cookie.cookieBehavior", 2);
pref("security.xpconnect.plugin.unrestricted", false);
pref("security.fileuri.strict_origin_policy", true);
pref("browser.link.open_newwindow.restriction", 1);
pref("layout.spellcheckDefault", 0);
pref("browser.cache.disk.capacity", 0);
pref("general.useragent.productSub", 0);
pref("general.buildID.override", "20000101000000");
pref("gecko.buildID", "20000101000000");
pref("gecko.mstone", "31.6.0");
pref("toolkit.telemetry.previousBuildID", "20000101000000");
pref("browser.startup.homepage_override.buildID", 1);
pref("browser.sessionstore.upgradeBackup.latestBuildID", "20000101000000");
pref("dom.event.clipboardevents.enabled", false);
pref("javascript.default_locale", "en-US");
pref("extensions.lastAppVersion", "31.6.0");
pref("extensions.lastPlatformVersion", "31.6.0");
pref("browser.migration.version", 22);
pref("intl.charsetmenu.browser.cache", "UTF-8");
pref("plugins.notifyMissingFlash", false);
pref("privacy.sanitize.migrateFx3Prefs", true);

// Enable the dark theme that it is in the firefox's developer build
pref("browser.devedition.theme.enabled", true);
// Now right click somewhere and select "Inspect Element"
// Click over the 'gear' icon with tooltip "Toolbox Options"
// Choose "Dark Theme"

// Disabled towards version 32
// pref("content.notify.interval", 750000);
// pref("content.switch.threshold", 750000);
// pref("content.interrupt.parsing", true);
// pref("content.max.tokenizing.time", 2250000);
// pref("network.http.max-connections-per-server", 16);