export const animateCart = (
  animateType: "to-cart" | "from-cart",
  imgToDrag?: HTMLImageElement,
  cart?: HTMLSpanElement
) => {
  if (imgToDrag && cart) {
    const imgClone = <HTMLImageElement>imgToDrag.cloneNode();
    imgClone.style.position = "absolute";
    imgClone.style.zIndex = "100";
    imgToDrag.insertAdjacentElement("afterend", imgClone);

    const {
      x: cartX,
      y: cartY,
      width: cartWidth,
      height: cartHeight,
    } = cart.getBoundingClientRect();
    const { x: imgX, y: imgY } = imgClone.getBoundingClientRect();

    const translate = {
      x: `${cartX - imgX - cartWidth * 2}px`,
      y: `${cartY - imgY - cartHeight * 2}px`,
    };

    const keyFrames: Keyframe[] = [];

    if (animateType === "to-cart") {
      keyFrames.push(
        {
          transform: `translate(0)`,
          width: `${imgClone.width}px`,
          height: `${imgClone.height}px`,
        },
        {
          transform: `translate(${translate.x}, ${translate.y})`,
          width: "10px",
          height: "10px",
        }
      );
    }

    if (animateType === "from-cart") {
      const imgCoords = {
        x: imgX + "px",
        y: imgY + "px",
      };

      keyFrames.push(
        {
          transform: `translate(${translate.x}, ${translate.y})`,
          width: "10px",
          height: "10px",
        },
        {
          transform: `translate(${imgCoords.x}, ${imgCoords.y}px)`,
          width: `${imgClone.width}px`,
          height: `${imgClone.height}px`,
        }
      );
    }

    imgClone.animate(keyFrames, {
      duration: 1000,
      easing: "ease-in-out",
    }).onfinish = () => imgClone.remove();
  }
};
