import {
  resizeImage,
  computeTargetDimensions,
  MAX_DIMENSION,
} from "../../../services/resizeApi";

import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Checkbox from "../../../components/ui/Checkbox";
import Button from "../../../components/ui/Button";

// Inverts computeTargetDimensions: given the 10,000px ceiling, what's
// the largest value the user could type in THIS unit? Lets the error
// message speak the same unit the person is looking at.
function getMaxAllowedValue(unit, dpi, originalDimension) {

  if (unit === "Percentage") {
    return Math.floor((MAX_DIMENSION / originalDimension) * 100);
  }

  if (unit === "Inches") {
    return Math.floor(MAX_DIMENSION / dpi);
  }

  if (unit === "Centimeters") {
    return Math.floor((MAX_DIMENSION / dpi) * 2.54);
  }

  return MAX_DIMENSION; // Pixels

}

export default function ResizeOptions({
  image,
  settings,
  setSettings,
  setResizedImage,
  setSettingsChanged,
  loading,
  setLoading,
}) {

  // ---------------- Unit Label ----------------

  const unitLabel = {

    Pixels: "px",

    Percentage: "%",

    Centimeters: "cm",

    Inches: "in",

  }[settings.unit];

  // ---------------- Width ----------------

  const handleWidthChange = (e) => {

    const value = e.target.value;

    setResizedImage(null);
    setSettingsChanged(true);

    if (!settings.keepAspect || !image) {

      setSettings({
        ...settings,
        width: value,
      });

      return;
    }

    if (settings.unit === "Percentage") {

      // Uniform scale — height% mirrors width% directly. Using the
      // pixel ratio here (like the other units) would be wrong: it
      // only "looked right" before because the pixel ratio happens
      // to be 1 on a square image.
      setSettings({
        ...settings,
        width: value,
        height: value,
      });

      return;
    }

    const newWidth = Number(value);

    if (!newWidth) {

      setSettings({
        ...settings,
        width: value,
        height: "",
      });

      return;
    }

    const ratio = image.height / image.width;

    setSettings({

      ...settings,

      width: value,

      height: Math.round(newWidth * ratio),

    });

  };

  // ---------------- Height ----------------

  const handleHeightChange = (e) => {

    const value = e.target.value;

    setResizedImage(null);
    setSettingsChanged(true);

    if (!settings.keepAspect || !image) {

      setSettings({
        ...settings,
        height: value,
      });

      return;
    }

    if (settings.unit === "Percentage") {

      setSettings({
        ...settings,
        height: value,
        width: value,
      });

      return;
    }

    const newHeight = Number(value);

    if (!newHeight) {

      setSettings({
        ...settings,
        height: value,
        width: "",
      });

      return;
    }

    const ratio = image.width / image.height;

    setSettings({

      ...settings,

      height: value,

      width: Math.round(newHeight * ratio),

    });

  };

  // ---------------- Keep Aspect Ratio toggle ----------------

  const handleKeepAspectToggle = (e) => {

    const checked = e.target.checked;

    setResizedImage(null);
    setSettingsChanged(true);

    // Turning it off just flips the flag — independent fields are
    // allowed to diverge from here on.
    if (!checked || !image) {

      setSettings({
        ...settings,
        keepAspect: checked,
      });

      return;
    }

    // Turning it ON: reconcile the fields immediately instead of
    // leaving a stale mismatched pair (e.g. 4 x 4) until the next
    // keystroke — which may never come before Resize is clicked.
    if (settings.unit === "Percentage") {

      if (settings.width !== "" && settings.width !== undefined) {

        setSettings({
          ...settings,
          keepAspect: true,
          height: settings.width,
        });

      } else if (settings.height !== "" && settings.height !== undefined) {

        setSettings({
          ...settings,
          keepAspect: true,
          width: settings.height,
        });

      } else {

        setSettings({
          ...settings,
          keepAspect: true,
        });

      }

      return;
    }

    const widthNum = Number(settings.width);
    const heightNum = Number(settings.height);

    if (widthNum > 0) {

      const ratio = image.height / image.width;

      setSettings({
        ...settings,
        keepAspect: true,
        height: Math.round(widthNum * ratio),
      });

    } else if (heightNum > 0) {

      const ratio = image.width / image.height;

      setSettings({
        ...settings,
        keepAspect: true,
        width: Math.round(heightNum * ratio),
      });

    } else {

      setSettings({
        ...settings,
        keepAspect: true,
      });

    }

  };

  // ---------------- Unit switch ----------------

  const handleUnitChange = (e) => {

    // Width/height typed under one unit are meaningless under another
    // (e.g. "1254" makes sense as px, not as a "%"). Clear them
    // instead of silently carrying the stale number forward.
    setSettings({
      ...settings,
      unit: e.target.value,
      width: "",
      height: "",
    });

    setResizedImage(null);

    setSettingsChanged(true);

  };

  // ---------------- Resize ----------------

  const handleResize = async () => {

    if (!image) {
      alert("Please upload an image first.");
      return;
    }

    const width = Number(settings.width);
    const height = Number(settings.height);

    if (!Number.isFinite(width) || width <= 0) {
      alert("Width must be greater than 0.");
      return;
    }

    if (!Number.isFinite(height) || height <= 0) {
      alert("Height must be greater than 0.");
      return;
    }

    const dpi = Number(settings.dpi) || 300;

    const { targetWidth, targetHeight } = computeTargetDimensions({
      unit: settings.unit,
      width,
      height,
      dpi,
      originalWidth: image.width,
      originalHeight: image.height,
    });

    if (targetWidth > MAX_DIMENSION || targetHeight > MAX_DIMENSION) {

      const maxWidthValue = getMaxAllowedValue(settings.unit, dpi, image.width);
      const maxHeightValue = getMaxAllowedValue(settings.unit, dpi, image.height);

      const dpiNote =
        settings.unit === "Inches" || settings.unit === "Centimeters"
          ? ` at ${dpi} DPI`
          : "";

      alert(
        `That would produce a ${targetWidth} × ${targetHeight} px image, ` +
        `which is over the 10,000 × 10,000 px limit.\n\n` +
        `For this image${dpiNote}, the max in ${unitLabel} is about ` +
        `${maxWidthValue} × ${maxHeightValue} ${unitLabel}.`
      );

      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("image", image.file);
      formData.append("width", settings.width);
      formData.append("height", settings.height);
      formData.append("unit", settings.unit);
      formData.append("dpi", settings.dpi);

      const result = await resizeImage(formData);

      const preview = URL.createObjectURL(result.blob);

      setResizedImage({

        preview,

        blob: result.blob,

        width: settings.width,
        height: settings.height,

        unit: settings.unit,

        dpi: settings.dpi,

        pixelWidth: result.pixelWidth,

        pixelHeight: result.pixelHeight,

      });

      setSettingsChanged(false);

    }

    catch (err) {

      console.error(err);

      alert(err.message || "Resize failed.");

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <Card>

      <h2 className="text-lg font-semibold text-white mb-6">

        Resize Settings

      </h2>

      <div className="flex flex-col gap-5">

        <Input
          label={`Width (${unitLabel})`}
          type="number"
          value={settings.width}
          onChange={handleWidthChange}
          suffix={unitLabel}
        />

        <Input
          label={`Height (${unitLabel})`}
          type="number"
          value={settings.height}
          onChange={handleHeightChange}
          suffix={unitLabel}
        />

        <Select
          label="Unit"
          value={settings.unit}
          onChange={handleUnitChange}
          options={[
            "Pixels",
            "Percentage",
            "Centimeters",
            "Inches",
          ]}
        />

        {(settings.unit === "Centimeters" ||
          settings.unit === "Inches") && (

          <Input
            label="DPI"
            type="number"
            value={settings.dpi}
            onChange={(e) => {

              setSettings({
                ...settings,
                dpi: e.target.value,
              });

              setResizedImage(null);

              setSettingsChanged(true);

            }}
          />

        )}

        <Checkbox
          label="Keep Aspect Ratio"
          checked={settings.keepAspect}
          onChange={handleKeepAspectToggle}
        />

        <Button
          onClick={handleResize}
          loading={loading}
          fullWidth
          size="lg"
        >

          Resize Image

        </Button>

      </div>

    </Card>

  );

}