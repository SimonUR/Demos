![Cover für diese Aufgabe](docs/cover.png)

# Image-Processing mit dem Video- und Canvas-Element

> Bitte beachten Sie beim Lesen dieser Zusammenfassung auch den Code der hier beschriebenen Lösung und probieren Sie die Anwendung aus. Nicht alle Teile des Codes werden detailliert beschrieben. Schauen Sie sich die angesprochenen Stellen daher selbstständige an und informieren Sie sich über die verlinkten Ressourcen. Eine Video-Datei zum Testen finden Sie im Starterpaket.

## Übersicht

![Screenshot der Anwendung](docs/screenshot-complete.png)

In diesem Beispiel lernen Sie den grundsätzlichen Umgang mit dem `video`-Element kennen. Darüber hinaus thematisierte diese Aufgabe die Möglichkeit Video- und Canvas-Funktionalitäten gemeinsam zu nutzen und durch das Zusammenspiel dieser Komponenten Echtzeiteffekte für die Video-Wiedergabe zu implementieren. Ziel ist es dabei, eine Webanwendung zu entwickeln die es dem Nutzer ermöglicht kompatible Video-Dateien abzuspielen und dabei die Wiedergabe durch visuelle Effekte (Graustufen, Helligkeit und Schwellenwert-Reduktion) zu verändern. Die Video-Dateien werden per *Drag & Drop* in die Anwendung importiert und dort in einem Video-Container wiedergegeben. Der Nutzer kann diesen Player durch entsprechende Schaltflächen steuern und das Video dadurch pausieren und stoppen. Regelmäßig (*24fps*) wird das aktuelle Videobild auf einem Canvas übertragen. Zusätzlich hat der Benutzer die Möglichkeit, einen der oben genannten Effekte zu aktivieren. Dieser wird dann auf die im Canvas angezeigten Video-Frames angewendet.

## Aufbau der Anwendung
Die Anwendung ist nach dem bekannten *(Revealing) Module Pattern* aufgebaut. Die zentrale Komponente wird durch das Modul `EffectPlayer` bereitgestellt. Die globale Variable `EffectPlayer` dient als Namespace für dieses und die übrigen Module der Anwendung. Die zentralen Funktionen von *Player* und *Canvas* zur Wiedergabe und Modifikation des Videos werden in separaten Modulen implementiert. Für die Benutzerinteraktion mit den jeweiligen Schaltflächen der beiden Komponenten werden eigene `View Controller* erstellt (`VideoControls` und `FilterControls`). Da weite Teile der Logik für diese Module identisch sind, werden die gemeinsamen Funktionalitäten im Modul `Controls` zusammengefasst. Die `that`-Schnittstellen der beiden Controls werden auf der Basis dieses Moduls erstellt. In einer letzte neuen Komponente (`CanvasFilter`) wird die Filter-Funktionalität für den Canvas implementiert. 

### DropTarget und EventPublisher
Der *Effect Player* nutzt die beiden externen Komponenten `DropTarget` sowie `EventPublisher`. Die nötigen Javascript-Dateien werden über die `index`-Datei eingebunden, wodurch die Module im Code verwendet werden können. Das DropTarget wird genutzt, um auch das Einfügen von Video-Dateien per *Drag and Drop* zu unterstützen. Wird eine kompatible Datei im `mp4`-Format auf dem verwalteten Element abgelegt, informiert das `DropTarget` registrierte *Listener* über einen `moviedropped`-Event.

## Der Video-Player
Die komplette Funktionalität zur Wiedergabe des importierten Videos wird in einem Modul (`VideoPlayer`) gekapselt, das ein entsprechendes `video`-Element (Parameter des Modulkonstruktors: `options.target`) verwaltet und über eine öffentliche Schnittstelle das Laden einer Videodatei sowie die Kontrolle der Wiedergabe erlaubt. Möglich sind das Abspielen, Pausieren und Stoppen des aktuell geladenen Videos. Zusätzlich kann festgelegt werden, ob das Video nach dem Ende der Wiedergabe erneut abgespielt wird (*loop*). In einem regelmäßigen Intervall wird das `video`-Element selbst über einen Event (`videoFrameAvailable`) an registrierte Listener weitergegeben um dadurch die Extraktion des aktuellen Video-Frames zu ermöglichen. Der *Broadcast* dieser Information kann über öffentliche Funktionen des Moduls ein- und ausgeschaltet werden. Dieser Teil des Moduls ist über ein Interval (`setInterval`) realisiert, dessen kontinuierlich aufgerufene Callback-Funktion das Versenden des Events übernimmt. Die regelmäßige Ausführung der Methode wird über `startBroadcasting` gesetzt und über `stopBroadcasting` beendet. Das *Broadcasting* erfolgt nur während der Wiedergabe eines Videos, wird also beim Pausieren oder Stoppen beendet.

### Video-Playback
Zur Wiedergabe der Video-Datei werden die HTML5-Media-Funktionalitäten bzw. das entsprechende `video`-Element genutzt. Das selektierte Element kann über eine Reihen von Methoden und Eigenschaften gesteuert werden. Für diese Anwendung sind davon unter anderem folgende Teilbereiche relevant:

* `.play()`: Die Methode startet die Wiedergabe des aktuell geladenen Inhalts an der aktuellen Position.
* `.pause()`: Durch den Aufruf dieser Methode wird die aktuelle Wiedergabe pausiert.
* `currentTime`: Diese Eigenschaft erlaubt das Auslesen und Setzen der aktuellen Wiedergabeposition.
* `loop`: Wird diese Eigenschaft auf true gesetzt, wird die Wiedergabe des aktuellen Inhalts nach dem Erreichen des Endes erneut gestartet.
* `src`: Mit dieser Eigenschaft kann der aktuelle Inhalt des Elements ausgelesen oder gesetzt werden. Erwartet wird eine valide URL

Einige Funktionalitäten, wie etwa das Stoppen der Wiedergabe und gleichzeitige Zurücksetzten der Wiedergabeposition auf den Anfang, werden nicht durch eigene Methoden abgebildet, sondern müssen durch Kombination der vorhandenen Möglichkeiten ergänzt werden.

```javascript
var target = // Selektiertes Video-Element
// ...

// Setzen einer vorhandenen Datei als Inhalt des Video-Elements
var src = URL.createObjectURL(file);
target.src = src;

// Playback-Kontrolle
target.play();
target.loop = false;
target.pause();
target.currentTime = 0;
```

Die Möglichkeiten zur Kontrolle der Wiedergabe werden aus dem Modul heraus (`that`) auch an andere Komponenten weitergegeben. Für die Kontrolle des Loop-Verhaltens besteht neben dem expliziten Setzen des Modus (`setLoopMode("loop" | "no-loop")`) auch die Möglichkeit, den Modus in Abhängigkeit des aktuellen Werts umzuschalten (`toogleLoopMode`).

### Events
Das `VideoPlayer`-Modul wird als EventPublisher realisiert und informiert registrierte Listener über eine Reihen von Ereignissen:

* `videoFrameAvailable`: Wird - wenn aktiviert - regelmäßig ausgelöst und enthält im Event-Parameter eine Referenz auf das Video-Element selbst.
* `videoPlayed`: Wird ausgelöst, wenn die Wiedergabe des Videos gestartet oder fortgesetzt wird.
* `videoPaused`: Wird ausgelöst, wenn die Wiedergabe des Videos pausiert wird.
* `videoStopped`: Wird ausgelöst, wenn die Wiedergabe des Videos beendet wird.
* `videoLoopModeChanged`: Wird ausgelöst, wenn der Loop-Modus geändert wird. Als Event-Parameter wird der neue Modus ("loop" oder "no-loop") übergeben.

## Das Canvas-Element
Das Modul zum Verwalten des `canvas`-Elements ist einfach gestaltet. Der `VideoCanvas` steuert einen Canvas, der als selektiertes Element beim Aufruf der Modul-Funktion übergeben wird (`options.target`) und bietet eine öffentliche Schnittstelle zum Zeichnen eines Video-Frames in diesen Canvas an.

### Zeichnen der Video-Frames
Zum Zeichnen wird die bekannte `drawImage`-Funktion des `context` verwendet, deren erster Parameter statt eines Image durch ein `video`-Element ersetzt werden kann. Beim Aufruf wird der aktuelle Inhalt des Videos (der aktuelle Frame) in den Canvas gezeichnet. Position und Größe können durch zusätzlich Parameter der Funktion spezifiziert werden. Die Funktion wird als `drawVideoFrame` im öffentlichen Interface des Moduls bereitgestellt. Durch wiederholten Aufruf der Methode können die einzelnen Frames eines Videos sequenziell in den Canvas gezeichnet werden. Wird hierbei eine entsprechend hohe und regelmäßige Framerate aufrechterhalten, wird im Ziel-Canvas der visuelle Eindruck einer kontinuierlichen Videowiedergabe erzeugt:

```javascript
// options.target enthält eine Referenz auf das relevante Canvas-Element
// context enthält eine Referenz auf den aus diesem Element extrahierten 2d-Context
function drawVideoFrame(video) {
    context.drawImage(video, 0, 0, options.target.width, options.target.height);
}
```

### Anwenden der Filter
Das eigentliche Implementieren der verschiedenen Bildfilter wird über eine separate Komponente realisiert. Das `VideoCanvas`-Modul stellt nur den strukturellen Rahmen für das Anwenden dieser Filter bereit. Relevant dafür sind zwei Bereich des Moduls. Über die Methode `setFilter` wird der aktuell zu verwendende Filter gesetzt. Als Parameter werden dazu String-Bezeichner übergeben. Dieser werden mit den bekannten Filtern verglichen. Bei Übereinstimmung wird die passende Filter-Funktion in der Variable `currentFilter` gespeichert. Die Zuordnung zwischen String-Bezeichner und tatsächlicher Filter-Funktion geschieht also im `VideoCanvas` und ist nach Außen hin nicht einsehbar. Mit der Methode `clearFilter` wird der aktuell gesetzte Filter deaktiviert.

Das `VideoCanvas`-Modul verfügt über eine eigene Instanz des `CanvasFilter`-Moduls, die in der Variable `filter` gespeichert wird. Beim Erzeugen dieses Moduls wird die Referenz auf das durch den `VideoCanvas` verwaltete `canvas`-Element übergeben. Ist ein Filter gesetzt worden, wird dieser in der `drawVideoFrame`-Methode, nach dem Zeichnen des Video-Frames, auf den Canvas angewendet:

```javascript
if (currentFilter) {
    filter.apply(currentFilter);
}
```

## Schaltflächen
Video-Player und Canvas verfügen über eine Reihe von Schaltflächen zum Steuern der Video-Wiedergabe und zum Aktivieren der unterschiedlichen Filtereffekte. Die jeweiligen Buttons können angeklickt werden und verfügen über zwei Zustände: aktiviert und deaktiviert. Der aktive Zustand wird über das Hinzufügen der CSS-Klasse active visualisiert. Die grundsätzlich Funktionalität zur Steuerung dieser Schaltflächen wird durch das Modul `Controls` bereitgestellt. Die zu verwaltenden Icons werden als DOM-Referenzen über den `options`-Parameter an die Modulfunktion übergeben. Innerhalb des Moduls werden die unterschiedlichen Schaltflächen über den Namen der zugehörigen Eigenschaft des Parameterobjekts referenziert:

```javascript
var options = {
    play: document.querySelector(".icon-play")
};
var myControls = new Controls(options);

// Zugriff auf den "Play"-Button innerhalb des Controls-Modul
var playButton = options["play"];
```

Das Modul erlaubt das Auslesen und Setzen des Zustandes der verwalteten Buttons über eine Reihen von Methoden. Als Parameter wird, wenn nötig, die Bezeichnung des anzusprechenden Buttons übergeben. Diese muss dabei mit der im Parameterobjekt verwendeten Eigenschaftsbezeichnung übereinstimmen:

* `setButtonState`: Setzt den Zustand des durch den Parameter spezifiziert Buttons auf `active`. Dazu wird die CSS-Klasse active zur Klassenliste des Buttons hinzugefügt.
* `clearButtonState`: Entfernt den `active`-Zustand des durch den Parameter spezifiziert Buttons durch Entfernen der entsprechende CSS-Klasse.
* `toggleButtonState`: Schaltet des Zustand für den im Parameter spezifiziert Button um.
* `getButtonState`: Gibt true zurück, wenn der durch den Parameter spezifiziert Button aktuell durch die entsprechende CSS-Klasse als `active` gekennzeichnet ist. Andernfalls wird false zurückgegeben.

Zusätzlich findet sich im `Controls`-Modul die Methode `onButtonClicked`. Diese dient als Callback für die `click`-Events, die durch die Benutzerinteraktion mit den Schaltflächen ausgelöst werden. Innerhalb der Methode wird der Typ des jeweiligen Buttons durch Auslesen und Verarbeiten der jeweiligen CSS-Klassen bestimmt und anschließend als Event an registrierte Listener weitergeben. Der Event-Typ setzt sich dabei aus dem Suffix `ButtonPressed` und des vorangestellten Typs des Buttons zusammen. Wird etwa auf einen Button geklickt, der durch den Bezeichner `play` identifiziert wird, wird beim Klick auf diesen ein `playButtonPressed`-Event ausgelöst. Um diese Funktionalität sicherzustellen, müssen bei der Initialisierung der konkreten Implementierung des `Controls`-Modul zwei Schritte beachten werden: In den Modulen `VideoControls` und `FilterControls` wird das `that`-Objekt auf der Basis eines `Controls`-Modul angelegt (siehe auch *EventPublisher*). Zusätzlich wird eine `init`-Methode ergänzt und beim Erzeugen des Moduls aufgerufen. In dieser Methode werden die im `options`-Parameter übergebenen Schaltflächen zuerst um eine, diese eindeutig identifizierende, CSS-Klasse ergänzt. Anschließend wird der `click`-Event auf den Elementen mit der onButtonClicked des in `that` gespeicherten `Controls`-Objekt verbunden:

```javascript
var EffectPlayer = EffectPlayer || {};
EffectPlayer.VideoControls = function(options) {
    var that = new EffectPlayer.Controls(options);

    function init() {
        options.play.classList.add("video-controls-play-button");
        options.play.addEventListener("click", that.onButtonClicked);
        // ...
    }

    init();
    return that;
};
```

Die zusätzlich vergebene CSS-Klasse wird in `Controls` ausgelesen und der Teil des Strings zwischen `-controls-` und `-button` als Typenbezeichnung für den Button und damit auch als Präfix für den Event-Typ verwendet.

In Abhängigkeit der Bezeichner, die für die übergebenen Schaltflächen verwendet werden, können unterschiedliche Events abgefangen werden. Wenn ein `play-` sowie ein `pause`-Button an das `VideoControls`-Modul übergeben werden, können anschließend Listener für die Events `playButtonPressed` und `pauseButtonPressed` registriert werden:

```javascript
function onFilterButtonClicked(filter) {
    // ...
}

function initFilterControls(canvasContainer) {
    filterControls = new EffectPlayer.FilterControls({
        grayscale: canvasContainer.querySelector(".icon-filter-grayscale"),
        brighten: canvasContainer.querySelector(".icon-filter-brighten"),
        threshold: canvasContainer.querySelector(".icon-filter-threshold"),
    });
    filterControls.addEventListener("grayscaleButtonPressed",
        onFilterButtonClicked.bind(null, "grayscale"));
    filterControls.addEventListener("thresholdButtonPressed",
        onFilterButtonClicked.bind(null, "threshold"));
    // ...
}
```

Damit im Code nicht manuell für jeden der Events eine eigene Callback-Methode definiert werden muss, wird beim Registrieren der Listener mit der `bind`-Funktion gearbeitet. Auf der Basis der `onFilterButtonClicked`-Methode wird für jedes Event mit Hilfe von `bind` eine neue Callback-Methode erzeugt, an die jeweils ein spezifischer, der Unterscheidung der gedrückten Schaltfläche dienender, Parameter gebunden wird. Der Ausführungskontext kann hier ignoriert werden und wird nicht explizit gesetzt.

## Visuelle Effekte

### Pixel-Manipulation des Canvas-Bildes

>> Die hier vorgestellte Lösung zeigt exemplarisch, wie der aktuelle Inhalt des Canvas pixelweise manipuliert werden kann, um graphische Effekte auf die dargestellten Bilder anzuwenden. Das Beispiel dient dabei nur der Veranschaulichung der tatsächlichen Möglichkeiten und ist nicht auf Wiedergabe-Performance optimiert. Für stabile Anwendung empfiehlt sich die Anpassung der Filter-Pipeline sowie der Rückgriff auf WebGL-Verfahren.

Das Canvas-Element erlaubt die Manipulation der aktuell dargestellten Inhalte durch Auslesen und Überschreiben der Farbwerte für die einzelnen Pixel. Dazu kann über die `getImageData`-Methode der Canvas komplett oder ausschnittsweise ausgelesen werden. Das zurückgegeben `ImageData`-Objekt repräsentiert die Pixel-Daten des Canvas und enthält neben Informationen über die Größe des Ausschnitts (`width` und `height`) die `data`-Eigenschaft. Dieses stellt die Pixelmatrix des Ausschnitts als *RGBA-Array* da. Jeweils vier aufeinanderfolgende Einträge bilden zusammen einen Pixel ab und enthalten dabei Farb- bzw. Transparenzinformationen:

```javascript
var context = canvas.getContext("2d"),
    imageData = context.getImageData(0, 0, canvas.width, canvas.height),
    pixelData = imageData.data;

pixelData[0]; // Rot-Wert des ersten Pixels (0 - 255)
pixelData[1]; // Grün-Wert des ersten Pixels (0 - 255)
pixelData[2]; // Blau-Wert des ersten Pixels (0 - 255)
pixelData[3]; // Alpha-Wert des ersten Pixels (0 - 255)
```

Durch ändern der Werte im Array können Sie die gespeicherten Farbinformationen manipulieren. Eine einfache Umwandlung des Bildes in eine Graustufen-Darstellung kann etwa durch das Bilden eines Durchschnittswertes der Rot-, Grün- und Blauwerte der einzelnen Pixel erfolgen. Der resultierende Werte wird dann für alle drei Kanäle gesetzt:

```javascript
// Umwandeln des Pixels an Position i in Graustufen
var grayscaleValue = (pixelData[i] + pixelData[i+1] + pixelData[i+2])/3
pixelData[i] = grayscaleValue;
pixelData[i+1] = grayscaleValue; 
pixelData[i+2] = grayscaleValue;
```

Da die drei RGB-Kanäle vom menschlichen Auge unterschiedlich wahrgenommen werden, können Sie das Ergebnis des Graustufeneffekts durch entsprechende [Gewichtung](https://en.wikipedia.org/wiki/Luma_%28video%29) der Farben optimieren:

```javascript
// Umwandeln in Graustufen mit Gewichtung
var optimalGrayscaleValue = 
    0.2126 * pixelData[i] + 0.7152 * pixelData[i+1] + 0.0722 * pixelData[i+2];
```

Anschließen kann das so modifizierte `ImageData`-Objekt dazu genutzt werden, die Änderungen auf den Canvas zu übertragen. Die Methode `putImageData` wird auf dem Canvas-Context aufgerufen und schreibt die als `ImageData`-Objekt übergebenen Pixel-Informationen in den Canvas. Der Zielausschnitt auf dem Canvas kann in Form zusätzlicher Parameter angegeben werden:

```javascript
context.putImageData(imageData, 0, 0);
```

### Filter-Pipeline
Für diese Aufgabe wird eine eigenständige Komponente (`CanvasFilter`) implementiert, die ein Canvas-Element übergeben bekommt und das Anwenden unterschiedlicher Filter auf die dort aktuell angezeigten Inhalte erlaubt. Die Filter selbst werden dabei als Funktionen definiert, die jeweils die (Farb-)Informationen eines einzelnen Pixels als Eingabe erhalten und den modifizierten Pixel zurückgeben. Die Filter-Komponente selbst stellt die Infrastruktur zum Anwenden dieser Filter bereit und bietet eine Funktion an, die eine übergebene Filter-Funktion für alle Pixel des Canvas aufruft, die Informationen im Pixel-Array durch die jeweilige Rückgabe überschreibt und das dadurch veränderte `ImageData`-Objekt in den Canvas schreibt.

Die Filter-Funktionen erwarten als Parameter ein Objekt folgenden Aufbaus:

```javascript
{
    red: // Rot-Kanal,
    green: // Grün-Kanal,
    blue: // Blau-Kanal,
    alpha: // Alpha-Kanal,
    position: // Position des Pixels innerhalb des ImageData-Objekts,
    data: // Array mit den Pixel-Informationen,
    width: // "Breite" des ImageData-Objekts,
    height: // "Höhe" des Image-Data-Objekts,
}
```

Die Filter-Komponente bildet durch passende Parameter, eine Reihe interner Funktionen und eine öffentliche Schnittstelle die komplette Filter-Pipeline ab:

#### Parameter
* Dem Modul wird das Canvas-Element als selektiertes DOM-Element übergeben. Das Modul übernimmt eigenständig die Aufgabe, auf den 2D-Kontext des Element zuzugreifen.

#### Interne Funktionen
* `getImageData`: Gibt die aktuellen ImageData-Informationen aus dem Canvas-Element zurück.
* `getPixelAtPosition`: Generiert - auf der Basis passender Parameter - ein Pixel-Objekt zur Verwendung in den Filter-Funktionen.
* `drawPixels`: Schreibt das übergebene `ImageData`-Objekt in den Canvas.
* `filter`: Wendet die übergebene Filter-Funktion auf alle Pixel des Canvas an. Diese Funktion stellt den Einstiegspunkt in die Filter-Pipeline dar.

#### Öffentliche Schnittstelle
* `apply`: Nutzt die übergeben Filter-Funktion um den dadurch definierten Filter zur Transformation des Canvas zu verwenden.

#### Eigene Filter ergänzen
Ein Beispiel für eine Filter-Funktion (Graustufen) sehen Sie hier:

```javascript
CanvasFilter.GRAYSCALE = function(pixel) {
    "use strict";
    var value = 0.2126 * pixel.red + 0.7152 * pixel.green + 0.0722 *
    pixel.blue;
    return {
        red: value,
        green: value,
        blue: value,
        alpha: pixel.alpha,
    };
};
```

Die Filter-Funktion nutzt das die globale Variable `CanvasFilter` als *Namespace*. In dieser Variable wird die Modul-Funktion zum Erzeugen der oben beschriebenen Filter-Komponente gespeichert. Es bietet sich an, die eigentliche Filter-Funktion durch nutzen dieses Namespaces hierarchisch dem `CanvasFilter`-Modul unterzuordnen. Eigene Filter können auf die gleiche Art und Weise angelegt werden. Die so komplettierte Filter-Komponente kann anschließend durch Erzeugen des entsprechenden Moduls und Anwenden der implementierten Filter genutzt werden:

```javascript
var canvas = document.querySelector(".canvas-container canvas"),
    filter = new CanvasFilter(canvas);

// Graustufen-Filter anwenden
filter.apply(CanvasFilter.GRAYSCALE);
```

Versuchen Sie selbstständig weitere Filter umzusetzen. Mögliche Ideen - die zum Teil auch in der bereitgestellten Lösung implementiert wurden - sind etwa die Veränderung der Helligkeit, Übermalen der Pixel mit Schwarz oder Weiß in Abhängigkeit eines Grenzwertes (*Threshold*), Invertieren der Farbwerte oder ein Weichzeichner. Denken Sie daran, dass beim Hinzufügen neuer Filter möglicherweise Anpassungen am *User Interface* der Anwendung nötig sind.


