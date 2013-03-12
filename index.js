
/**
 * Expose `getFile`.
 */

module.exports = getFile;

/**
 * Get the supported XHR object in current browser
 *
 * @return {object}
 * @api private
 */
function getXHR() {
  if (window.XMLHttpRequest) { return new XMLHttpRequest; } 
  else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  return false;
}

/**
 * Get file using file:// (local) or http:// (server)
 *
 * @param {String} path
 * @api public
 */
function getFile(path, callback) {

  // TODO: Make sure no remote files are requested
  // var isRemote = /^([\w-]+:)?\/\/([^\/]+)/.test(path) && RegExp.$2 != window.location.host,
  
  var xhr = getXHR();

  if (xhr) {

    xhr.open('GET', path, false);

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        xhr.onreadystatechange = function() {};
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && window.location.protocol == 'file:')) {
          callback(null, xhr.responseText);
        }
        else {
          if (xhr.status === 400) {
            callback({error: 'Could not locate file'}, null);
          }
          else {
            callback({error: xhr.status}, null);
          }
        }
      }
    }

    xhr.send(null);

  }
  else {
    throw new Error('XMLHttpRequest or ActiveXObject is not available. Cannot get file.')
  }

}