import { useCallback, useEffect, useId, useRef } from "react";
import { useInViewOnce } from "../lib/atelierMotion";

const EMBLEM_PATHS = {
  northStar:
    "M 310.9 122.0 L 331.8 116.0 C 331.8 116.0 334.4 112.4 335.7 109.0 C 337.1 105.5 340.2 94.3 340.2 94.3 C 340.2 94.3 342.5 104.5 343.8 108.0 C 345.1 111.4 347.0 114.3 348.5 116.0 C 350.0 117.6 350.0 117.3 353.2 118.3 C 356.3 119.3 368.4 122.0 368.4 122.0 C 368.4 122.0 357.4 125.4 354.2 126.7 C 350.9 127.9 349.8 128.3 348.1 130.0 C 346.5 131.6 345.2 133.4 343.9 137.0 C 342.6 140.5 340.2 151.9 340.2 151.9 C 340.2 151.9 335.8 136.5 334.5 133.0 C 333.3 129.4 333.6 131.0 332.3 130.0 C 331.0 129.0 329.6 128.0 326.2 126.7 C 322.7 125.4 310.9 122.0 310.9 122.0 Z",
  lancetUpper:
    "M 340.2 171.9 C 340.2 171.9 346.0 264.8 345.1 286.0 C 344.1 307.1 334.2 304.0 334.2 304.0 L 340.2 171.9 Z",
  wingLeft:
    "M 181.2 153.8 C 181.2 153.8 186.0 169.1 190.7 181.0 C 195.4 192.8 198.0 199.8 210.7 228.0 C 223.4 256.1 270.3 357.0 270.3 357.0 L 264.2 352.1 C 264.2 352.1 262.6 351.9 261.2 353.7 C 259.7 355.4 256.2 359.9 254.9 363.0 C 253.5 366.0 252.3 369.4 252.6 373.0 C 252.9 376.5 253.6 379.5 256.5 385.0 C 259.5 390.4 268.8 393.2 271.2 407.0 C 273.5 420.7 271.0 471.0 271.0 471.0 L 268.0 471.0 C 268.0 471.0 265.5 460.9 262.4 456.0 C 259.4 451.0 252.9 443.7 249.2 440.1 C 245.4 436.5 244.4 436.2 239.2 433.5 C 233.9 430.8 221.8 426.6 216.2 423.1 C 210.6 419.6 208.3 416.8 204.2 411.7 C 200.0 406.7 190.2 391.4 190.2 391.4 C 190.2 391.4 232.7 415.7 241.2 420.3 C 249.6 424.9 242.8 420.0 242.8 420.0 C 242.8 420.0 202.9 387.8 192.2 379.0 C 181.6 370.1 181.1 370.3 176.2 364.5 C 171.2 358.8 165.6 350.6 161.1 343.0 C 156.6 335.3 151.3 323.8 148.1 317.0 C 144.9 310.1 141.1 300.0 141.1 300.0 L 238.2 397.4 L 239.1 397.0 C 239.1 397.0 188.5 320.8 176.9 302.0 C 165.4 283.1 170.0 287.1 167.0 279.0 C 164.0 270.8 160.2 260.4 158.0 251.0 C 155.7 241.5 153.8 227.4 153.1 220.0 C 152.3 212.5 153.2 204.4 153.2 204.4 C 153.2 204.4 167.4 234.5 180.6 258.0 C 193.8 281.4 226.3 335.3 235.8 351.0 C 245.2 366.6 239.8 356.0 239.8 356.0 C 239.8 356.0 197.1 255.4 188.2 233.0 C 179.2 210.6 185.0 221.9 183.9 216.0 C 182.7 210.0 181.8 203.0 181.2 196.0 C 180.5 188.9 180.0 178.7 180.0 172.0 C 180.0 165.2 181.2 153.8 181.2 153.8 Z",
  wingRight:
    "M 499.2 154.0 C 499.2 154.0 500.4 161.8 500.6 167.0 C 500.7 172.1 500.6 179.7 500.3 186.0 C 499.9 192.2 499.5 198.9 498.3 206.0 C 497.2 213.0 502.6 205.8 493.3 230.0 C 484.0 254.1 440.0 357.0 440.0 357.0 C 440.0 357.0 445.2 350.6 454.7 335.0 C 464.2 319.3 489.3 276.7 499.5 259.0 C 509.7 241.2 514.1 232.7 518.5 224.0 C 522.9 215.2 527.2 204.1 527.2 204.1 C 527.2 204.1 527.1 219.3 526.3 227.0 C 525.6 234.6 524.5 243.0 522.3 252.0 C 520.0 260.9 515.5 274.3 512.2 283.0 C 508.8 291.6 512.5 287.9 501.2 306.0 C 490.0 324.0 451.5 381.1 441.9 396.0 C 432.3 410.8 441.2 398.8 441.2 398.8 C 441.2 398.8 503.0 336.9 518.7 321.0 C 534.4 305.0 539.2 298.8 539.2 298.8 C 539.2 298.8 541.8 295.0 539.3 301.0 C 536.8 306.9 528.5 326.4 523.4 336.0 C 518.3 345.6 513.0 354.1 507.4 361.0 C 501.7 367.8 499.4 369.6 488.2 379.0 C 477.0 388.5 437.4 420.0 437.4 420.0 L 438.2 420.8 C 438.2 420.8 436.8 422.0 445.2 417.4 C 453.5 412.8 490.2 391.8 490.2 391.8 C 490.2 391.8 483.5 403.0 479.5 408.0 C 475.5 412.9 471.7 418.5 465.1 423.0 C 458.5 427.4 444.6 431.7 438.2 435.5 C 431.7 439.3 428.3 442.9 424.7 447.0 C 421.1 451.0 418.1 455.6 415.6 461.0 C 413.1 466.4 409.2 480.7 409.2 480.7 C 409.2 480.7 406.8 422.4 409.3 407.0 C 411.8 391.5 421.8 389.2 424.8 384.0 C 427.7 378.7 427.5 377.0 427.8 374.0 C 428.2 370.9 428.0 368.2 426.7 365.0 C 425.5 361.8 421.4 356.0 419.9 354.0 C 418.4 352.0 417.2 352.4 417.2 352.4 L 410.8 356.0 C 410.8 356.0 463.9 241.0 476.5 213.0 C 489.2 185.0 486.1 190.4 489.7 181.0 C 493.3 171.5 499.2 154.0 499.2 154.0 Z",
  spireLeftUpper:
    "M 302.2 206.8 C 302.2 206.8 311.0 287.4 312.7 303.0 C 314.5 318.5 313.2 303.8 313.2 303.8 C 313.2 303.8 313.6 305.1 314.7 303.0 C 315.8 300.8 320.2 290.5 320.2 290.5 C 320.2 290.5 320.6 259.9 320.6 292.0 C 320.6 324.0 320.2 490.9 320.2 490.9 L 312.1 490.0 L 311.9 331.0 L 310.8 331.0 C 310.8 331.0 302.5 346.5 300.6 351.0 C 298.8 355.4 299.9 357.0 299.4 359.0 C 298.9 360.9 299.3 359.9 297.4 363.0 C 295.4 366.0 287.0 378.0 287.0 378.0 C 287.0 378.0 287.1 329.3 287.7 318.0 C 288.3 306.6 288.4 324.7 290.7 307.0 C 293.0 289.2 302.2 206.8 302.2 206.8 Z",
  spireRightUpper:
    "M 378.2 208.1 C 378.2 208.1 387.4 289.2 389.7 307.0 C 392.0 324.7 392.0 305.8 392.5 319.0 C 393.0 332.1 391.5 375.2 392.7 389.0 C 393.8 402.7 399.7 405.0 399.7 405.0 L 381.1 434.0 C 381.1 434.0 382.5 370.3 380.8 354.0 C 379.1 337.6 372.4 335.8 370.5 332.0 C 368.6 328.1 369.2 330.2 369.2 330.2 C 369.2 330.2 368.7 311.3 368.6 331.0 C 368.5 350.6 369.7 431.1 368.3 453.0 C 367.0 474.8 360.2 467.3 360.2 467.3 L 359.9 291.0 L 365.8 303.0 L 366.9 303.0 L 378.2 208.1 Z",
  spireRightLowerA:
    "M 401.2 416.2 L 401.5 490.0 L 381.7 491.0 C 381.7 491.0 378.0 459.9 381.1 448.0 C 384.2 436.0 401.2 416.2 401.2 416.2 Z",
  spireRightLowerB:
    "M 368.2 467.8 L 368.4 490.0 L 360.2 490.6 L 360.2 480.0 Z",
  monolithLBase:
    "M 345.2 300.2 L 352.9 496.0 L 427.2 496.7 L 427.2 502.6 L 346.2 503.1 L 340.2 488.8 L 335.2 503.0 L 266.2 503.1 L 265.2 490.6 L 251.1 490.0 L 251.2 477.6 L 278.8 477.0 C 278.8 477.0 275.7 423.4 278.8 407.0 C 281.9 390.5 298.2 374.2 298.2 374.2 C 298.2 374.2 298.9 363.5 299.1 383.0 C 299.3 402.4 299.6 496.0 299.6 496.0 L 327.2 496.8 C 327.2 496.8 326.8 524.3 327.9 496.0 C 329.0 467.7 331.0 351.3 333.7 320.0 C 336.5 288.6 345.2 300.2 345.2 300.2 Z",
  voluteScroll:
    "M 199.4 481.0 C 201.0 479.4 203.0 477.8 205.2 476.6 C 207.4 475.5 210.6 474.2 213.2 473.8 C 215.7 473.4 218.6 473.4 221.2 473.9 C 223.7 474.4 226.9 475.7 229.0 477.0 C 231.1 478.2 232.9 480.0 234.2 481.6 C 235.5 483.2 236.6 485.3 237.2 487.1 C 237.8 488.9 238.0 490.9 237.9 493.0 C 237.7 495.0 237.1 498.2 236.3 500.0 C 235.4 501.7 233.8 503.0 232.6 504.0 C 231.4 504.9 230.2 505.6 228.7 506.0 C 227.2 506.3 224.5 506.4 223.2 506.3 C 221.8 506.2 221.1 506.0 220.2 505.2 C 219.2 504.3 217.4 501.0 217.4 501.0 C 217.4 501.0 221.6 503.1 223.2 503.4 C 224.7 503.7 225.8 503.5 227.2 502.6 C 228.5 501.8 230.9 499.7 231.6 498.0 C 232.4 496.2 232.2 493.6 231.8 492.0 C 231.4 490.4 230.5 489.1 229.1 488.0 C 227.8 486.8 225.6 485.0 223.2 484.6 C 220.8 484.2 216.5 484.5 214.2 485.4 C 211.8 486.2 209.8 488.3 208.4 490.0 C 207.0 491.6 205.7 493.4 205.5 496.0 C 205.2 498.5 205.8 503.4 206.7 506.0 C 207.6 508.6 209.5 510.5 211.2 512.2 C 212.8 513.9 215.1 515.4 217.2 516.5 C 219.2 517.5 221.7 518.2 224.2 518.6 C 226.6 519.0 232.2 519.0 232.2 519.0 L 225.2 512.6 C 225.2 512.6 231.8 516.6 239.2 517.5 C 246.5 518.5 264.1 518.1 271.2 518.8 C 278.2 519.4 279.0 520.3 283.2 521.8 C 287.3 523.2 293.2 525.7 297.2 527.8 C 301.2 529.9 304.3 531.7 308.2 534.9 C 312.0 538.0 317.6 543.3 321.2 547.3 C 324.7 551.3 327.3 554.9 330.3 560.0 C 333.4 565.0 340.2 579.1 340.2 579.1 C 340.2 579.1 346.2 566.8 349.1 562.0 C 351.9 557.1 355.1 552.7 358.1 549.0 C 361.2 545.3 364.0 542.2 368.2 538.8 C 372.3 535.4 379.8 530.3 384.2 527.7 C 388.5 525.2 391.2 524.3 395.2 522.9 C 399.2 521.5 401.6 519.8 409.2 518.9 C 416.7 518.0 434.8 518.4 442.2 517.3 C 449.5 516.3 455.2 512.5 455.2 512.5 C 455.2 512.5 454.8 513.9 453.6 515.0 C 452.4 516.0 447.8 519.0 447.8 519.0 C 447.8 519.0 451.0 519.3 453.2 519.1 C 455.3 518.8 458.8 518.5 461.2 517.5 C 463.6 516.6 466.2 515.0 468.2 513.1 C 470.1 511.3 472.4 508.4 473.5 506.0 C 474.7 503.5 475.0 500.2 475.0 498.0 C 475.0 495.7 474.7 493.8 473.6 492.0 C 472.5 490.1 469.8 487.6 468.2 486.4 C 466.5 485.2 464.8 484.7 463.2 484.4 C 461.6 484.1 459.8 484.2 458.2 484.5 C 456.6 484.9 454.6 485.4 453.2 486.5 C 451.7 487.7 449.7 490.3 449.0 492.0 C 448.3 493.6 448.1 495.3 448.8 497.0 C 449.4 498.6 453.2 502.5 453.2 502.5 L 460.2 502.6 C 460.2 502.6 462.5 500.7 463.0 500.0 C 463.4 499.2 463.2 498.0 463.2 498.0 C 463.2 498.0 462.7 501.8 462.2 503.0 C 461.8 504.1 461.1 504.6 460.2 505.1 C 459.2 505.6 457.8 506.2 456.2 506.2 C 454.6 506.3 452.1 506.5 450.2 505.3 C 448.2 504.2 445.1 500.9 443.9 499.0 C 442.7 497.0 442.6 495.1 442.6 493.0 C 442.7 490.8 443.3 487.4 444.2 485.3 C 445.0 483.2 446.2 481.5 447.7 480.0 C 449.2 478.5 450.7 477.0 453.3 476.0 C 455.9 474.9 461.5 473.7 464.2 473.4 C 466.8 473.0 467.7 473.4 469.7 474.0 C 471.7 474.5 474.2 475.0 476.7 477.0 C 479.2 478.9 483.5 482.7 485.4 486.0 C 487.2 489.3 488.2 493.9 488.2 497.6 C 488.1 501.2 486.7 505.7 485.3 509.0 C 483.9 512.2 481.6 515.2 479.2 517.6 C 476.7 520.0 473.4 522.3 470.2 524.0 C 466.9 525.6 458.7 528.0 458.7 528.0 C 458.7 528.0 466.0 528.0 469.2 527.3 C 472.3 526.6 475.6 525.1 478.2 523.6 C 480.7 522.1 483.1 520.2 485.2 517.8 C 487.2 515.5 491.2 508.7 491.2 508.7 C 491.2 508.7 491.9 508.3 491.3 510.0 C 490.7 511.6 489.0 516.4 487.5 519.0 C 486.1 521.5 484.1 523.7 482.2 525.7 C 480.2 527.6 477.6 529.7 475.2 531.1 C 472.8 532.5 471.0 533.5 467.2 534.2 C 463.3 534.8 459.3 535.9 451.2 535.2 C 443.0 534.4 424.0 530.1 416.2 529.5 C 408.3 528.9 407.3 530.0 402.2 531.5 C 397.0 532.9 389.1 535.9 384.2 538.5 C 379.2 541.1 373.6 545.6 371.2 547.6 C 368.8 549.5 369.2 550.5 369.2 550.5 C 369.2 550.5 379.1 545.7 384.2 544.8 C 389.2 543.9 400.5 545.0 400.5 545.0 C 400.5 545.0 395.3 545.5 392.2 546.4 C 389.1 547.3 385.3 548.2 381.2 550.5 C 377.0 552.8 370.9 556.4 366.2 560.7 C 361.4 564.9 355.9 570.8 351.7 577.0 C 347.5 583.2 340.2 599.4 340.2 599.4 C 340.2 599.4 334.3 584.9 330.5 579.0 C 326.6 573.0 319.6 565.7 316.0 562.0 C 312.5 558.2 310.9 557.5 308.2 555.6 C 305.5 553.8 301.7 551.9 299.2 550.5 C 296.6 549.2 295.0 548.3 292.2 547.4 C 289.3 546.5 281.2 545.1 281.2 545.1 C 281.2 545.1 290.4 544.0 295.2 544.8 C 300.0 545.7 311.2 550.5 311.2 550.5 L 312.0 550.0 C 312.0 550.0 309.8 547.6 307.2 545.6 C 304.5 543.6 299.5 539.7 295.2 537.5 C 290.8 535.2 285.0 533.0 280.2 531.7 C 275.4 530.4 269.5 529.7 265.2 529.5 C 260.8 529.3 258.9 529.6 253.2 530.5 C 247.4 531.4 234.6 534.4 229.2 535.2 C 223.7 535.9 222.6 535.7 219.2 535.2 C 215.7 534.7 210.5 533.3 207.4 532.0 C 204.3 530.6 202.2 529.2 199.7 527.0 C 197.2 524.7 193.6 520.9 191.9 518.0 C 190.2 515.1 189.2 508.9 189.2 508.9 C 189.2 508.9 190.7 512.8 192.4 515.0 C 194.2 517.1 197.2 520.6 200.2 522.5 C 203.2 524.5 207.8 526.5 211.2 527.3 C 214.5 528.2 221.3 528.0 221.3 528.0 C 221.3 528.0 214.7 526.2 212.2 525.1 C 209.6 524.0 207.4 522.9 205.2 521.2 C 202.9 519.4 199.8 516.2 198.2 514.3 C 196.5 512.3 195.8 511.4 194.8 509.0 C 193.9 506.5 192.4 501.7 192.1 499.0 C 191.8 496.2 192.4 494.0 192.9 492.0 C 193.4 489.9 194.1 487.9 195.2 486.1 C 196.2 484.3 197.8 482.5 199.4 481.0 Z",
  crimsonCore: [
    "M 274.6 510.0 C 274.6 510.0 282.8 508.4 285.2 508.2 C 287.5 508.0 283.6 509.0 289.2 508.9 C 294.8 508.7 313.6 507.3 320.2 507.3 C 326.7 507.4 330.2 509.3 330.2 509.3 C 330.2 509.3 331.5 510.6 331.3 512.0 C 331.2 513.3 330.4 516.0 329.2 518.0 C 328.1 519.9 326.9 522.1 324.3 524.0 C 321.7 525.8 315.9 528.7 313.2 529.3 C 310.4 529.9 309.7 528.9 307.2 527.6 C 304.6 526.3 302.2 523.6 297.0 521.0 C 291.7 518.3 274.2 511.2 274.2 511.2 L 274.6 510.0 Z",
    "M 350.2 509.3 C 350.2 509.3 356.2 507.4 358.2 507.2 C 360.1 507.0 358.6 508.1 362.2 508.1 C 365.7 508.2 373.8 507.5 380.2 507.6 C 386.6 507.7 398.2 508.4 402.2 508.7 C 406.1 509.1 404.8 510.0 404.8 510.0 L 404.8 511.0 C 404.8 511.0 391.1 517.2 387.2 519.3 C 383.2 521.4 382.9 522.7 380.2 524.2 C 377.4 525.6 372.4 527.6 370.2 528.4 C 367.9 529.2 367.8 529.1 366.2 529.0 C 364.6 528.8 361.9 528.5 360.2 527.7 C 358.4 526.9 357.0 526.0 355.3 524.0 C 353.6 521.9 350.4 517.3 349.6 515.0 C 348.8 512.6 350.2 509.3 350.2 509.3 Z",
    "M 338.8 517.0 L 341.2 516.6 C 341.2 516.6 349.5 527.9 352.2 531.0 C 355.0 534.1 358.2 536.0 358.2 536.0 C 358.2 536.0 359.6 535.5 356.8 539.0 C 353.9 542.4 340.2 557.5 340.2 557.5 L 322.2 536.0 C 322.2 536.0 328.0 531.0 330.7 528.0 C 333.3 524.9 338.8 517.0 338.8 517.0 Z",
  ],
} as const;

const WORDMARK_LETTERS: readonly { key: string; cx: number; d: string }[] = [
  {
    key: "L",
    cx: 28,
    d: "M 15.1 29.2 C 15.1 29.2 25.4 28.9 27.7 28.9 C 30.0 28.9 29.3 29.2 29.3 29.2 C 29.3 29.2 28.1 29.7 27.6 30.2 C 27.1 30.7 26.6 31.3 26.2 32.2 C 25.9 33.1 25.5 29.9 25.4 35.7 C 25.4 41.6 26.0 68.7 26.0 68.7 C 26.0 68.7 25.5 69.1 27.0 69.6 C 28.4 70.1 32.5 71.0 34.9 72.0 C 37.3 72.9 39.5 74.4 42.1 75.5 C 44.6 76.5 48.3 78.1 50.7 78.5 C 53.1 79.0 55.7 78.6 57.2 78.5 C 58.7 78.3 59.0 78.1 60.0 77.5 C 61.0 76.8 63.5 74.6 63.5 74.6 L 63.7 75.6 C 63.7 75.6 61.5 79.4 60.5 80.5 C 59.5 81.6 58.4 82.1 57.5 82.6 C 56.5 83.1 56.1 83.4 54.7 83.6 C 53.3 83.8 50.9 84.4 48.7 83.8 C 46.5 83.2 43.1 81.3 40.7 79.7 C 38.3 78.2 35.8 75.7 33.5 74.1 C 31.2 72.6 29.2 70.7 26.3 70.0 C 23.4 69.2 15.2 69.5 15.2 69.5 C 15.2 69.5 17.2 68.4 17.7 67.7 C 18.2 67.0 18.4 70.2 18.6 65.2 C 18.8 60.2 18.8 41.4 18.8 36.5 C 18.8 31.5 18.8 34.9 18.6 34.2 C 18.4 33.5 18.2 32.8 17.6 32.0 C 17.1 31.2 15.1 29.2 15.1 29.2 Z",
  },
  {
    key: "E",
    cx: 61,
    d: "M 47.0 29.2 C 47.0 29.2 68.6 28.9 73.0 29.0 C 77.3 29.0 74.0 29.5 74.0 29.5 C 74.0 29.5 74.5 32.5 74.7 34.0 C 74.8 35.4 74.8 37.6 74.8 38.5 C 74.8 39.4 74.5 39.6 74.5 39.6 C 74.5 39.6 71.6 34.6 70.5 33.3 C 69.3 32.0 68.5 31.6 67.2 31.2 C 65.9 30.7 63.7 30.4 62.2 30.4 C 60.7 30.3 58.5 30.7 57.7 30.9 C 56.9 31.1 57.0 31.5 57.0 31.5 C 57.0 31.5 56.8 31.9 56.8 34.5 C 56.8 37.0 57.0 47.5 57.0 47.5 C 57.0 47.5 57.1 47.8 57.7 47.8 C 58.3 47.8 60.0 47.7 61.0 47.5 C 61.9 47.3 62.5 47.1 63.5 46.6 C 64.4 46.0 66.7 44.0 66.7 44.0 C 66.7 44.0 67.0 43.2 67.1 44.7 C 67.3 46.2 67.6 51.7 67.6 53.2 C 67.7 54.7 67.5 54.0 67.5 54.0 C 67.5 54.0 67.4 54.5 67.0 53.8 C 66.5 53.2 65.1 50.5 64.5 49.7 C 63.9 48.9 64.2 48.8 63.2 48.7 C 62.2 48.6 59.4 48.7 58.5 48.9 C 57.5 49.1 57.2 49.8 57.2 49.8 L 57.2 67.7 C 57.2 67.7 57.7 68.5 58.2 68.7 C 58.7 68.9 58.8 68.8 60.2 68.8 C 61.6 68.8 65.3 68.6 66.7 68.5 C 68.1 68.3 68.6 68.0 69.2 67.7 C 69.8 67.4 69.8 67.7 70.5 66.5 C 71.3 65.2 73.2 61.3 73.9 60.0 C 74.7 58.6 75.5 58.1 75.5 58.1 C 75.5 58.1 75.9 58.0 75.8 59.5 C 75.7 60.9 75.1 65.6 74.8 67.2 C 74.4 68.8 73.5 69.6 73.5 69.6 C 73.5 69.6 71.4 69.9 67.2 69.9 C 63.0 69.9 47.4 69.5 47.4 69.5 C 47.4 69.5 49.2 68.1 49.6 67.5 C 50.1 66.8 50.0 70.2 50.2 65.2 C 50.3 60.2 50.5 41.8 50.4 36.5 C 50.3 31.1 50.0 33.1 49.5 32.0 C 48.9 30.8 47.0 29.2 47.0 29.2 Z",
  },
  {
    key: "F",
    cx: 92,
    d: "M 79.1 29.2 C 79.1 29.2 100.0 29.0 104.2 29.0 C 108.4 28.9 105.5 29.1 105.5 29.1 C 105.5 29.1 105.8 28.5 106.0 30.0 C 106.3 31.4 106.8 36.4 106.8 38.0 C 106.9 39.5 106.5 39.4 106.5 39.4 C 106.5 39.4 105.4 38.5 105.1 38.0 C 104.8 37.4 104.9 37.0 104.5 36.2 C 104.0 35.5 103.2 34.2 102.5 33.4 C 101.7 32.6 100.9 31.7 99.5 31.2 C 98.2 30.7 95.4 30.3 94.0 30.2 C 92.5 30.1 91.4 30.4 90.7 30.6 C 90.0 30.7 89.8 31.2 89.8 31.2 C 89.8 31.2 89.5 40.2 89.5 43.0 C 89.6 45.7 90.2 48.3 90.2 48.3 C 90.2 48.3 90.4 48.8 91.5 48.7 C 92.5 48.6 95.8 47.8 97.0 47.5 C 98.1 47.1 98.1 46.8 98.5 46.4 C 98.8 46.0 99.2 45.1 99.2 45.1 L 99.8 45.2 C 99.8 45.2 100.0 44.8 100.0 46.0 C 100.0 47.1 100.1 51.2 100.0 52.5 C 99.9 53.8 99.5 54.1 99.5 54.1 C 99.5 54.1 97.9 51.1 97.5 50.4 C 97.0 49.7 97.6 49.8 96.5 49.8 C 95.3 49.7 91.5 49.7 90.5 49.8 C 89.4 49.9 89.7 50.5 89.7 50.5 C 89.7 50.5 89.6 64.1 89.8 67.0 C 90.1 69.8 90.6 68.1 91.0 68.5 C 91.4 68.8 92.6 69.0 92.6 69.0 L 92.5 69.8 C 92.5 69.8 82.3 69.9 80.2 69.8 C 78.1 69.8 79.3 69.5 79.3 69.5 C 79.3 69.5 79.3 69.0 79.7 68.7 C 80.1 68.4 81.5 67.9 81.9 67.5 C 82.3 67.0 82.3 70.9 82.4 66.0 C 82.5 61.0 82.8 41.6 82.8 36.5 C 82.8 31.3 82.7 34.7 82.5 34.0 C 82.3 33.2 82.1 32.4 81.5 31.7 C 81.0 31.0 79.6 30.2 79.2 29.8 C 78.8 29.4 79.1 29.2 79.1 29.2 Z",
  },
  {
    key: "I1",
    cx: 117,
    d: "M 110.3 29.2 L 123.7 29.2 L 123.4 30.5 C 123.4 30.5 122.3 30.8 122.0 31.1 C 121.6 31.4 121.3 31.2 121.0 32.2 C 120.8 33.2 120.5 32.0 120.5 37.5 C 120.4 42.9 120.5 61.2 120.6 66.2 C 120.8 71.2 121.3 68.5 121.3 68.5 L 123.4 69.2 L 123.0 69.8 C 123.0 69.8 114.2 69.9 112.2 69.9 C 110.2 69.8 110.3 69.5 110.3 69.5 C 110.3 69.5 111.9 68.8 112.4 68.5 C 112.9 68.1 113.2 68.7 113.4 67.2 C 113.6 65.7 113.6 64.6 113.6 59.2 C 113.6 53.8 113.6 38.1 113.5 33.7 C 113.3 29.3 113.0 32.0 112.5 31.5 C 112.1 30.9 111.1 30.8 110.7 30.5 C 110.3 30.1 110.3 29.2 110.3 29.2 Z",
  },
  {
    key: "C",
    cx: 143,
    d: "M 134.0 33.0 C 135.4 31.7 137.2 30.6 138.8 30.0 C 140.4 29.3 141.9 28.9 144.0 28.7 C 146.0 28.6 149.5 28.5 151.7 29.0 C 153.9 29.4 157.6 31.5 157.6 31.5 C 157.6 31.5 157.9 31.7 157.8 32.5 C 157.7 33.3 157.2 35.4 156.7 36.5 C 156.3 37.6 155.2 39.3 155.2 39.3 C 155.2 39.3 154.9 39.3 154.7 38.7 C 154.6 38.1 154.7 36.5 154.5 35.7 C 154.3 34.9 154.1 34.4 153.5 33.7 C 152.9 33.0 151.3 31.6 150.5 31.1 C 149.6 30.5 148.9 30.3 148.2 30.1 C 147.5 30.0 146.9 29.9 146.0 30.0 C 145.0 30.2 143.1 30.7 142.2 31.1 C 141.3 31.4 140.9 31.7 140.2 32.2 C 139.6 32.7 138.9 33.3 138.2 34.2 C 137.6 35.2 136.7 36.9 136.1 38.2 C 135.6 39.5 135.3 40.3 135.0 42.2 C 134.7 44.1 134.4 47.8 134.4 50.2 C 134.4 52.6 134.8 55.4 135.1 57.0 C 135.4 58.6 135.6 59.0 136.1 60.2 C 136.6 61.4 137.6 63.3 138.2 64.3 C 138.9 65.3 139.3 65.9 140.2 66.6 C 141.1 67.2 142.4 68.2 144.0 68.5 C 145.5 68.8 148.6 68.9 150.1 68.5 C 151.7 68.0 152.8 66.5 153.5 65.8 C 154.2 65.2 154.1 65.1 154.5 64.2 C 154.9 63.3 155.6 60.8 156.0 60.2 C 156.3 59.5 156.5 59.9 156.5 59.9 C 156.5 59.9 156.8 59.4 157.0 60.5 C 157.3 61.5 158.0 65.0 158.1 66.2 C 158.2 67.4 158.0 67.3 157.7 67.7 C 157.5 68.1 157.1 68.2 156.5 68.6 C 155.8 68.9 154.9 69.4 153.5 69.7 C 152.1 70.1 149.8 70.7 147.7 70.7 C 145.6 70.7 141.9 70.0 140.2 69.7 C 138.5 69.3 138.2 69.2 137.2 68.7 C 136.3 68.2 135.0 67.4 134.1 66.7 C 133.3 66.0 132.6 65.4 132.0 64.6 C 131.3 63.8 130.6 62.9 130.0 61.7 C 129.3 60.5 128.4 58.3 128.0 57.0 C 127.6 55.6 127.4 54.9 127.2 53.2 C 127.1 51.5 126.9 48.1 127.1 46.5 C 127.2 44.8 127.5 44.1 128.0 42.7 C 128.4 41.4 128.9 39.8 129.9 38.2 C 130.8 36.6 132.5 34.3 134.0 33.0 Z",
  },
  {
    key: "I2",
    cx: 168,
    d: "M 161.0 29.1 C 161.0 29.1 172.1 28.8 174.5 28.8 C 176.8 28.8 175.5 29.2 175.5 29.2 C 175.5 29.2 172.8 30.6 172.2 32.0 C 171.5 33.3 171.6 31.9 171.5 37.5 C 171.5 43.1 171.6 62.0 171.9 67.0 C 172.1 71.9 172.4 68.1 172.8 68.5 C 173.3 68.8 174.5 69.2 174.5 69.2 L 174.0 69.9 C 174.0 69.9 164.9 70.0 163.0 69.9 C 161.0 69.9 161.5 69.5 161.5 69.5 L 161.7 68.9 C 161.7 68.9 163.0 68.6 163.5 68.2 C 163.9 67.9 164.3 71.4 164.5 66.7 C 164.7 62.0 164.7 44.3 164.7 39.0 C 164.7 33.6 164.6 34.6 164.4 33.5 C 164.2 32.3 164.0 32.1 163.5 31.5 C 162.9 30.9 161.0 29.6 161.0 29.6 L 161.0 29.1 Z",
  },
  {
    key: "O",
    cx: 198,
    d: "M 184.0 34.0 C 184.6 33.3 185.2 32.7 186.2 32.1 C 187.2 31.4 188.9 30.4 190.2 29.9 C 191.5 29.3 192.8 29.0 194.2 28.8 C 195.6 28.6 198.0 28.6 199.2 28.7 C 200.4 28.7 201.0 28.8 202.0 29.1 C 202.9 29.3 205.2 30.5 205.2 30.5 L 206.0 30.0 C 206.0 30.0 206.8 30.3 207.2 30.6 C 207.6 30.8 208.0 31.3 208.5 31.6 C 208.9 31.8 209.4 31.4 210.2 32.1 C 211.0 32.8 212.8 34.6 213.7 35.8 C 214.6 36.9 215.2 38.2 215.7 39.3 C 216.2 40.3 216.4 40.8 216.8 42.2 C 217.1 43.6 217.6 46.6 217.7 48.2 C 217.8 49.8 217.7 50.8 217.6 52.2 C 217.4 53.6 217.1 55.6 216.7 57.2 C 216.2 58.8 215.4 60.8 214.7 62.0 C 214.1 63.2 213.5 63.8 212.7 64.7 C 211.9 65.6 210.7 66.8 209.5 67.6 C 208.2 68.4 206.6 69.2 204.9 69.7 C 203.1 70.2 200.4 70.6 198.5 70.6 C 196.5 70.6 194.1 70.2 192.5 69.8 C 190.8 69.3 188.8 67.9 188.0 67.5 C 187.1 67.2 187.5 67.5 187.2 67.7 C 186.9 67.9 186.2 69.0 186.2 69.0 L 183.8 67.7 L 184.5 65.7 C 184.5 65.7 182.7 63.8 182.0 62.6 C 181.2 61.5 180.3 60.0 179.8 58.7 C 179.3 57.4 179.1 56.0 178.9 54.5 C 178.6 52.9 178.5 50.6 178.5 49.0 C 178.5 47.4 178.7 45.8 178.9 44.5 C 179.1 43.1 179.5 41.7 180.0 40.5 C 180.5 39.2 181.3 37.5 182.0 36.4 C 182.6 35.4 183.3 34.7 184.0 34.0 Z M 190.2 33.1 C 189.3 34.3 187.8 36.9 187.2 38.5 C 186.6 40.1 186.3 40.6 186.2 43.2 C 186.0 45.8 185.9 52.2 186.2 55.0 C 186.4 57.8 187.8 60.7 187.8 60.7 L 186.9 62.5 L 189.7 63.9 L 190.9 62.2 C 190.9 62.2 190.1 63.3 190.0 63.7 C 189.9 64.1 189.7 64.2 190.1 64.7 C 190.4 65.2 191.3 66.1 192.2 66.7 C 193.1 67.3 194.5 68.1 195.5 68.5 C 196.6 68.8 197.6 68.8 198.7 68.8 C 199.8 68.8 201.4 68.7 202.2 68.5 C 203.1 68.2 203.4 68.0 204.1 67.5 C 204.7 66.9 205.8 66.0 206.5 65.0 C 207.2 63.9 208.0 62.2 208.5 61.0 C 209.0 59.7 209.3 58.7 209.5 57.2 C 209.8 55.7 210.1 52.9 210.1 51.5 C 210.2 50.0 210.1 49.3 210.0 48.0 C 209.9 46.6 209.8 44.6 209.6 43.2 C 209.3 41.8 209.0 40.7 208.5 39.5 C 208.0 38.2 206.5 35.6 206.5 35.6 L 205.5 36.8 L 202.9 35.2 L 203.8 33.2 C 203.8 33.2 202.1 31.6 201.2 31.1 C 200.3 30.7 199.3 30.5 198.5 30.4 C 197.6 30.3 196.8 30.4 196.0 30.5 C 195.1 30.7 194.0 30.8 193.0 31.2 C 192.1 31.6 191.1 31.9 190.2 33.1 Z",
  },
  {
    key: "U",
    cx: 238,
    d: "M 220.3 29.2 C 220.3 29.2 219.3 28.8 221.5 28.8 C 223.6 28.8 233.6 29.2 233.6 29.2 L 233.5 29.7 C 233.5 29.7 231.5 30.6 231.0 31.2 C 230.4 31.8 230.2 29.2 230.0 33.7 C 229.8 38.2 229.8 54.7 230.0 59.5 C 230.1 64.2 230.7 62.2 231.2 63.2 C 231.6 64.2 232.3 65.0 233.0 65.7 C 233.7 66.4 234.6 67.1 235.5 67.5 C 236.3 67.8 237.4 67.9 238.5 67.9 C 239.5 67.9 240.8 67.7 241.7 67.5 C 242.6 67.2 243.3 66.9 244.1 66.5 C 244.8 66.0 245.8 65.5 246.5 64.7 C 247.2 64.0 247.9 63.0 248.5 61.8 C 249.0 60.7 249.5 62.0 249.7 57.5 C 249.9 53.0 249.9 37.8 249.7 33.7 C 249.5 29.6 249.2 32.3 248.5 31.7 C 247.7 31.0 245.6 30.1 245.1 29.7 C 244.5 29.3 244.9 29.2 244.9 29.2 C 244.9 29.2 245.0 28.9 246.2 28.9 C 247.4 29.0 250.9 29.4 252.2 29.3 C 253.5 29.3 253.7 28.9 254.2 28.8 C 254.7 28.8 255.4 29.2 255.4 29.2 C 255.4 29.2 252.8 31.0 252.2 31.7 C 251.6 32.4 251.9 28.8 251.7 33.5 C 251.4 38.1 251.2 55.9 250.7 61.0 C 250.3 66.0 249.6 63.9 248.7 65.1 C 247.8 66.4 245.9 68.0 244.9 68.7 C 243.9 69.4 243.3 69.6 242.7 69.8 C 242.1 70.0 242.6 70.0 241.0 70.0 C 239.3 70.0 234.3 70.2 232.2 69.8 C 230.1 69.4 229.1 68.6 228.0 67.8 C 226.8 66.9 225.7 65.4 225.0 64.5 C 224.4 63.5 224.2 63.0 223.9 62.0 C 223.7 60.9 223.4 62.6 223.3 58.0 C 223.2 53.3 223.3 37.0 223.2 32.7 C 223.1 28.4 222.9 31.6 222.5 31.2 C 222.2 30.8 221.3 30.8 221.0 30.5 C 220.6 30.1 220.3 29.2 220.3 29.2 Z",
  },
  {
    key: "S",
    cx: 270,
    d: "M 260.0 31.8 C 260.6 31.0 261.4 30.4 262.2 29.9 C 263.0 29.5 263.9 29.2 264.7 29.0 C 265.6 28.7 266.2 28.6 267.7 28.6 C 269.2 28.6 272.7 28.7 274.2 28.9 C 275.8 29.1 276.6 29.6 277.4 30.0 C 278.1 30.3 278.5 30.6 278.8 31.2 C 279.2 31.8 279.6 32.6 279.6 33.5 C 279.6 34.3 279.4 35.7 278.9 36.7 C 278.4 37.7 276.5 39.9 276.5 39.9 L 275.9 39.2 L 276.9 38.7 C 276.9 38.7 277.4 37.5 277.3 36.7 C 277.3 35.9 277.1 34.8 276.6 34.0 C 276.1 33.1 275.1 31.8 274.5 31.2 C 273.8 30.6 273.3 30.3 272.5 30.1 C 271.6 29.9 270.1 29.8 269.2 29.8 C 268.3 29.8 267.4 29.8 266.6 30.2 C 265.8 30.6 264.7 31.6 264.1 32.2 C 263.6 32.8 263.3 33.4 263.0 34.0 C 262.8 34.6 262.6 35.2 262.6 36.0 C 262.6 36.7 262.6 37.6 263.0 38.5 C 263.4 39.4 264.4 40.8 265.2 41.6 C 266.0 42.4 266.6 42.8 268.0 43.5 C 269.3 44.2 271.8 45.1 273.5 46.0 C 275.1 46.8 277.4 48.1 278.5 49.0 C 279.7 49.8 280.0 50.2 280.7 51.1 C 281.4 51.9 282.3 53.0 282.7 54.5 C 283.2 55.9 283.7 58.6 283.7 60.2 C 283.6 61.8 283.3 63.0 282.7 64.2 C 282.1 65.4 280.8 66.8 279.8 67.7 C 278.7 68.6 277.5 69.2 276.2 69.7 C 274.9 70.2 273.0 70.5 271.4 70.7 C 269.8 70.9 267.7 70.8 266.2 70.7 C 264.7 70.5 263.2 70.0 262.2 69.7 C 261.2 69.4 261.0 69.4 260.2 68.7 C 259.3 68.0 257.6 66.2 256.9 65.2 C 256.2 64.2 256.1 63.3 256.0 62.7 C 255.9 62.1 255.8 61.6 256.0 61.2 C 256.2 60.8 256.4 60.4 257.0 60.0 C 257.6 59.6 259.0 59.2 259.7 58.7 C 260.3 58.2 261.2 56.6 261.2 56.6 L 261.7 57.2 C 261.7 57.2 260.3 58.9 260.0 59.7 C 259.8 60.5 259.8 61.1 260.1 62.2 C 260.5 63.3 261.4 65.4 262.1 66.5 C 262.8 67.5 263.6 68.1 264.5 68.6 C 265.3 69.0 266.8 69.3 267.7 69.5 C 268.5 69.6 268.9 69.7 270.0 69.5 C 271.0 69.4 273.1 69.0 274.1 68.5 C 275.2 67.9 275.9 67.0 276.5 66.2 C 277.0 65.3 277.5 64.0 277.6 63.0 C 277.8 61.9 277.9 60.5 277.5 59.5 C 277.0 58.4 275.9 57.1 275.0 56.2 C 274.0 55.3 273.6 55.1 271.7 54.1 C 269.8 53.0 264.8 50.7 263.0 49.6 C 261.1 48.6 260.9 48.1 260.2 47.5 C 259.6 46.8 259.3 46.4 258.9 45.7 C 258.5 45.0 258.1 44.4 257.8 43.2 C 257.6 42.0 257.3 39.8 257.3 38.5 C 257.3 37.1 257.5 36.0 257.9 35.0 C 258.3 33.9 259.3 32.6 260.0 31.8 Z",
  },
];

const SLASH_LINE = { x1: 214.7, y1: 19.07, x2: 178.6, y2: 79.17 } as const;

type ArcPrimitive = { d: string; tier: 1 | 2 | 3 };
type HookPrimitive = { cx: number; cy: number };

const ASTROLABE_GEOMETRY = (() => {
  const quads: readonly [number, number][] = [
    [-162, -105],
    [-75, -18],
    [18, 75],
    [105, 162],
  ];
  const arcs: ArcPrimitive[] = [];
  const hooks: HookPrimitive[] = [];
  const cx = 340;
  const cy = 340;

  const makeArc = (r: number, a0: number, a1: number) => {
    const s = (a0 * Math.PI) / 180;
    const e = (a1 * Math.PI) / 180;
    const x1 = cx + Math.cos(s) * r;
    const y1 = cy + Math.sin(s) * r;
    const x2 = cx + Math.cos(e) * r;
    const y2 = cy + Math.sin(e) * r;
    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  };

  for (const [a0, a1] of quads) {
    arcs.push({ d: makeArc(287, a0, a1), tier: 1 });
    arcs.push({ d: makeArc(271.5, a0 + 3, a1 - 3), tier: 2 });
    arcs.push({ d: makeArc(263, a0 + 7, a1 - 7), tier: 3 });

    const s = ((a0 + 3) * Math.PI) / 180;
    const e = ((a1 - 3) * Math.PI) / 180;
    hooks.push({
      cx: Number((cx + Math.cos(s) * 262.5 - Math.sin(s) * 6).toFixed(1)),
      cy: Number((cy + Math.sin(s) * 262.5 + Math.cos(s) * 6).toFixed(1)),
    });
    hooks.push({
      cx: Number((cx + Math.cos(e) * 262.5 + Math.sin(e) * 6).toFixed(1)),
      cy: Number((cy + Math.sin(e) * 262.5 - Math.cos(e) * 6).toFixed(1)),
    });
  }

  return { arcs, hooks };
})();

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const prog = (t: number, t0: number, dur: number) => clamp01((t - t0) / dur);
const easeOutExpo = (x: number) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x));
const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4);
const easeOutBack = (x: number) => {
  const c1 = 1.32;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

function getCrestPalette(tone: "obsidian" | "vellum" | "gilt") {
  if (tone === "vellum") {
    return {
      fg: "#181312",
      muted: "#6d5840",
      crimson: "#8a181a",
      glint: "#fffaf0",
    };
  }
  if (tone === "gilt") {
    return {
      fg: "#f5ebd6",
      muted: "#d8b47c",
      crimson: "#a61c1f",
      glint: "#fffdf6",
    };
  }
  return {
    fg: "#f2ece0",
    muted: "#b5a68e",
    crimson: "#a31b1e",
    glint: "#fffef8",
  };
}

function setRigTransform(
  el: SVGGElement | SVGPolygonElement | null,
  tx: number,
  ty: number,
  rotDeg: number,
  sc: number,
  ox: number,
  oy: number,
) {
  if (!el) return;
  el.setAttribute(
    "transform",
    `translate(${tx.toFixed(2)}, ${ty.toFixed(2)}) translate(${ox}, ${oy}) rotate(${rotDeg.toFixed(2)}) scale(${sc.toFixed(3)}) translate(${-ox}, ${-oy})`,
  );
}

export type B04CrestProps = {
  className?: string;
  tone?: "obsidian" | "vellum" | "gilt";
  detentStep?: number;
  interactive?: boolean;
  calibrating?: boolean;
  compact?: boolean;
};

/**
 * B-04 Cathedral Monolith, Detached 3-Blade Gothic Wings & Victorian Volute Crest.
 * Supports horological detent ratcheting (`detentStep`), Spine/Header hover articulation,
 * and `<Suspense>` calibration spin with 0 SSR hydration delta.
 */
export function B04Crest({
  className = "h-11 w-11",
  tone = "obsidian",
  detentStep = 0,
  interactive = false,
  calibrating = false,
  compact = false,
}: B04CrestProps) {
  const pal = getCrestPalette(tone);
  const strokeBoost = compact ? 1.55 : 1.0;

  const wingLRef = useRef<SVGGElement | null>(null);
  const wingRRef = useRef<SVGGElement | null>(null);
  const crimsonRef = useRef<SVGGElement | null>(null);
  const prevDetentRef = useRef<number>(detentStep);
  const pulseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (prevDetentRef.current === detentStep) return;
    prevDetentRef.current = detentStep;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    wingLRef.current?.setAttribute(
      "style",
      "transform-box:view-box;transform-origin:271px 455px;transition:transform 420ms cubic-bezier(0.16,1,0.3,1);transform:rotate(-5.5deg) translate(-3px,-2px);",
    );
    wingRRef.current?.setAttribute(
      "style",
      "transform-box:view-box;transform-origin:409px 455px;transition:transform 420ms cubic-bezier(0.16,1,0.3,1);transform:rotate(5.5deg) translate(3px,-2px);",
    );
    crimsonRef.current?.setAttribute(
      "style",
      "transition:filter 320ms ease;filter:drop-shadow(0 0 8px rgba(196,34,38,0.85));",
    );

    if (pulseTimerRef.current) window.clearTimeout(pulseTimerRef.current);
    pulseTimerRef.current = window.setTimeout(() => {
      wingLRef.current?.setAttribute(
        "style",
        "transform-box:view-box;transform-origin:271px 455px;transition:transform 520ms cubic-bezier(0.22,1,0.36,1);transform:rotate(0deg);",
      );
      wingRRef.current?.setAttribute(
        "style",
        "transform-box:view-box;transform-origin:409px 455px;transition:transform 520ms cubic-bezier(0.22,1,0.36,1);transform:rotate(0deg);",
      );
      crimsonRef.current?.setAttribute("style", "transition:filter 520ms ease;filter:none;");
    }, 220);

    return () => {
      if (pulseTimerRef.current) window.clearTimeout(pulseTimerRef.current);
    };
  }, [detentStep]);

  const diamondRotation = detentStep * 45;

  return (
    <svg
      viewBox={compact ? "48 48 584 584" : "16 16 648 648"}
      aria-hidden="true"
      className={`shrink-0 overflow-visible ${className}`}
    >
      {/* 1. Outer Broken Double-Astrolabe Gimbal */}
      <g
        style={{ transformBox: "view-box", transformOrigin: "340px 340px" }}
        className={
          calibrating
            ? "animate-[spin_9s_linear_infinite]"
            : interactive
              ? "transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-[24deg]"
              : undefined
        }
      >
        {ASTROLABE_GEOMETRY.arcs.map((arc, idx) => (
          <path
            key={idx}
            d={arc.d}
            fill="none"
            stroke={pal.muted}
            strokeWidth={
              (arc.tier === 1 ? 2.15 : arc.tier === 2 ? 1.55 : 1.15) * strokeBoost
            }
            opacity={arc.tier === 3 ? 0.78 : 0.94}
          />
        ))}
        {!compact &&
          ASTROLABE_GEOMETRY.hooks.map((h, idx) => (
            <circle
              key={idx}
              cx={h.cx}
              cy={h.cy}
              r="4.3"
              fill="none"
              stroke={pal.muted}
              strokeWidth={1.35 * strokeBoost}
              opacity="0.85"
            />
          ))}
        <line x1="340" y1="20" x2="340" y2="49" stroke={pal.muted} strokeWidth={1.8 * strokeBoost} />
        <line x1="340" y1="631" x2="340" y2="660" stroke={pal.muted} strokeWidth={1.8 * strokeBoost} />
        <line x1="20" y1="340" x2="49" y2="340" stroke={pal.muted} strokeWidth={1.8 * strokeBoost} />
        <line x1="631" y1="340" x2="660" y2="340" stroke={pal.muted} strokeWidth={1.8 * strokeBoost} />
      </g>

      {/* 2. Rotated 45-Degree Double-Diamond & Side Crescent Brackets */}
      <g
        style={{
          transformBox: "view-box",
          transformOrigin: "340px 340px",
          transform: diamondRotation ? `rotate(${diamondRotation}deg)` : undefined,
          transition: "transform 620ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className={
          calibrating
            ? "animate-[spin_14s_linear_infinite_reverse]"
            : interactive && !diamondRotation
              ? "group-hover:rotate-[45deg]"
              : undefined
        }
      >
        <polygon
          points="340,60 620,340 340,620 60,340"
          fill="none"
          stroke={pal.muted}
          strokeWidth={2.1 * strokeBoost}
        />
        <polygon
          points="340,72.5 607.5,340 340,607.5 72.5,340"
          fill="none"
          stroke={pal.muted}
          strokeWidth={1.35 * strokeBoost}
          opacity="0.82"
        />
        <path
          d="M 122 292 A 223 223 0 0 0 122 388 A 232 232 0 0 1 122 292 Z"
          fill={pal.muted}
          opacity="0.8"
        />
        <path
          d="M 558 292 A 223 223 0 0 1 558 388 A 232 232 0 0 0 558 292 Z"
          fill={pal.muted}
          opacity="0.8"
        />
      </g>

      {/* 3. Smooth Detached 3-Blade Gothic Wings */}
      <g
        ref={wingLRef}
        style={{ transformBox: "view-box", transformOrigin: "271px 455px" }}
        className={
          interactive
            ? "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-[5deg]"
            : undefined
        }
      >
        <path d={EMBLEM_PATHS.wingLeft} fill={pal.fg} fillRule="evenodd" />
      </g>
      <g
        ref={wingRRef}
        style={{ transformBox: "view-box", transformOrigin: "409px 455px" }}
        className={
          interactive
            ? "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[5deg]"
            : undefined
        }
      >
        <path d={EMBLEM_PATHS.wingRight} fill={pal.fg} fillRule="evenodd" />
      </g>

      {/* 4. 45-Degree Sliced Twin Gothic Spires & Asymmetric L-Beam */}
      <g>
        <path d={EMBLEM_PATHS.monolithLBase} fill={pal.fg} fillRule="evenodd" />
        <path d={EMBLEM_PATHS.spireLeftUpper} fill={pal.fg} fillRule="evenodd" />
        <path d={EMBLEM_PATHS.spireRightUpper} fill={pal.fg} fillRule="evenodd" />
        <path d={EMBLEM_PATHS.spireRightLowerA} fill={pal.fg} fillRule="evenodd" />
        <path d={EMBLEM_PATHS.spireRightLowerB} fill={pal.fg} fillRule="evenodd" />
      </g>

      {/* 5. Axial Clocktower Lancet Needle & 4-Point North Star */}
      <g>
        <path d={EMBLEM_PATHS.lancetUpper} fill={pal.fg} fillRule="evenodd" />
        <path d={EMBLEM_PATHS.northStar} fill={pal.fg} fillRule="evenodd" />
      </g>

      {/* 6. Crimson Inlay Chambers & B-04 Streamlined Victorian Volute Cradle */}
      <g ref={crimsonRef}>
        {EMBLEM_PATHS.crimsonCore.map((d, idx) => (
          <path key={idx} d={d} fill={pal.crimson} fillRule="evenodd" />
        ))}
      </g>
      <g>
        <path d={EMBLEM_PATHS.voluteScroll} fill={pal.fg} fillRule="evenodd" />
      </g>
    </svg>
  );
}

/**
 * Alias kept for backward compatibility with any quiet crest consumers.
 */
export function BrandCrest({ className = "h-5 w-5" }: { className?: string }) {
  return <B04Crest compact className={className} />;
}

/**
 * Custom Victorian-Didone `LEFICIØUS` vector wordmark featuring the swept `L` tail
 * and 45-degree diagonal `Ø` razor slash. Fires a subtle specular slash redraw on
 * hover or whenever `triggerKey` changes across routes.
 */
export function LeficiousWordmark({
  className = "h-[24px] w-auto",
  color = "#f7f0e2",
  glintColor = "#fff8e8",
  triggerKey,
  ariaLabel = "Leficious",
}: {
  className?: string;
  color?: string;
  glintColor?: string;
  triggerKey?: string;
  ariaLabel?: string | null;
}) {
  const slashRef = useRef<SVGLineElement | null>(null);
  const glintRef = useRef<SVGLineElement | null>(null);
  const letterRefs = useRef<(SVGPathElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const runningRef = useRef<boolean>(false);
  const prevTriggerRef = useRef<string | undefined>(triggerKey);

  const playSlashGlint = useCallback(() => {
    if (runningRef.current) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    runningRef.current = true;
    const start = performance.now();
    const dur = 0.54;

    const frame = (now: number) => {
      const t = (now - start) / 1000;
      if (t < dur) {
        const pSlash = easeOutExpo(clamp01(t / 0.34));
        slashRef.current?.setAttribute("stroke-dashoffset", (100 * (1 - pSlash)).toFixed(1));

        const pGlint = clamp01(t / 0.42);
        const glintOp = Math.sin(pGlint * Math.PI) * 0.9;
        glintRef.current?.setAttribute("opacity", glintOp.toFixed(2));

        const sweepX = (t / dur) * 310 - 10;
        WORDMARK_LETTERS.forEach((item, idx) => {
          const dist = Math.abs(item.cx - sweepX);
          const hot = dist < 34 ? Math.cos((dist / 34) * (Math.PI / 2)) : 0;
          letterRefs.current[idx]?.setAttribute("fill", hot > 0.35 ? glintColor : color);
        });

        rafRef.current = window.requestAnimationFrame(frame);
      } else {
        slashRef.current?.setAttribute("stroke-dashoffset", "0");
        glintRef.current?.setAttribute("opacity", "0");
        letterRefs.current.forEach((el) => el?.setAttribute("fill", color));
        runningRef.current = false;
      }
    };

    rafRef.current = window.requestAnimationFrame(frame);
  }, [color, glintColor]);

  useEffect(() => {
    if (prevTriggerRef.current !== triggerKey) {
      prevTriggerRef.current = triggerKey;
      playSlashGlint();
    }
  }, [playSlashGlint, triggerKey]);

  useEffect(() => {
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <span onPointerEnter={playSlashGlint} className="inline-flex items-center">
      <svg
        viewBox="13 17 273 69"
        aria-hidden="true"
        className={`block shrink-0 overflow-visible ${className}`}
      >
        {WORDMARK_LETTERS.map((item, idx) => (
          <path
            key={item.key}
            ref={(el) => {
              letterRefs.current[idx] = el;
            }}
            d={item.d}
            fill={color}
            fillRule="evenodd"
          />
        ))}
        <line
          ref={slashRef}
          pathLength="100"
          x1={SLASH_LINE.x1}
          y1={SLASH_LINE.y1}
          x2={SLASH_LINE.x2}
          y2={SLASH_LINE.y2}
          stroke={color}
          strokeWidth="2.25"
          strokeLinecap="square"
          strokeDasharray="100"
          strokeDashoffset="0"
        />
        <line
          ref={glintRef}
          x1={SLASH_LINE.x1 + 4}
          y1={SLASH_LINE.y1 - 6}
          x2={SLASH_LINE.x2 - 4}
          y2={SLASH_LINE.y2 + 6}
          stroke={glintColor}
          strokeWidth="3.4"
          opacity="0"
        />
      </svg>
      {ariaLabel ? <span className="sr-only">{ariaLabel}</span> : null}
    </span>
  );
}

/**
 * Sticky navbar horizontal lockup pairing the compact B-04 Crest with `LEFICIØUS`.
 */
export function NavbarBrandLockup() {
  return (
    <span className="group inline-flex items-center gap-2.5">
      <B04Crest compact interactive tone="gilt" className="h-8 w-8" />
      <LeficiousWordmark className="h-[20px] w-auto sm:h-[22px]" color="#ebd09e" ariaLabel="Leficious" />
    </span>
  );
}

/**
 * Full 8-layer choreographed B-04 Crest + `LEFICIØUS` Intro Sting (~1.32s build + ~0.33s poise = 1.65s)
 * driven at native display refresh rate for the landing curtain sequence.
 */
export function B04IntroSting() {
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const clipMonoId = `intro-mono-${rawId}`;
  const clipVolId = `intro-vol-${rawId}`;

  const astroRef = useRef<SVGGElement | null>(null);
  const arcRefs = useRef<(SVGPathElement | null)[]>([]);
  const diaRef = useRef<SVGGElement | null>(null);
  const clipMonoPolyRef = useRef<SVGPolygonElement | null>(null);
  const monoRef = useRef<SVGGElement | null>(null);
  const starRef = useRef<SVGGElement | null>(null);
  const starGlintRef = useRef<SVGGElement | null>(null);
  const lancetRef = useRef<SVGGElement | null>(null);
  const wingLRef = useRef<SVGGElement | null>(null);
  const wingRRef = useRef<SVGGElement | null>(null);
  const clipVolRectRef = useRef<SVGRectElement | null>(null);
  const voluteRef = useRef<SVGGElement | null>(null);
  const crimsonRef = useRef<SVGGElement | null>(null);
  const crimsonRingRef = useRef<SVGPolygonElement | null>(null);
  const wmLetterRefs = useRef<(SVGGElement | null)[]>([]);
  const oSlashRef = useRef<SVGLineElement | null>(null);
  const oGlintRef = useRef<SVGLineElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const el of [
        astroRef.current,
        diaRef.current,
        monoRef.current,
        starRef.current,
        lancetRef.current,
        wingLRef.current,
        wingRRef.current,
        voluteRef.current,
        crimsonRef.current,
        ...wmLetterRefs.current,
      ]) {
        el?.setAttribute("opacity", "1");
      }
      oSlashRef.current?.setAttribute("opacity", "1");
      return;
    }

    let rafId = 0;
    const start = performance.now();
    const leadIn = 0.12;
    const totalDur = 1.48;

    const renderFrame = (now: number) => {
      const rawElapsed = Math.min(totalDur, (now - start) / 1000);
      const t = Math.max(0, rawElapsed - leadIn);

      // 1. Astrolabe arcs draw + CCW spin (0.00s - 0.52s)
      const pAstro = easeOutExpo(prog(t, 0.0, 0.52));
      astroRef.current?.setAttribute("opacity", clamp01(t / 0.18).toFixed(2));
      setRigTransform(astroRef.current, 0, 0, -48 * (1 - pAstro), 0.9 + 0.1 * pAstro, 340, 340);
      for (const a of arcRefs.current) {
        if (!a) continue;
        a.setAttribute("stroke-dasharray", "100");
        a.setAttribute("stroke-dashoffset", (100 * (1 - pAstro)).toFixed(1));
      }

      // 2. 45-degree Diamond detent snap (0.06s - 0.56s)
      const pDiaRaw = prog(t, 0.06, 0.5);
      const pDia = easeOutBack(pDiaRaw);
      diaRef.current?.setAttribute("opacity", clamp01((t - 0.05) / 0.16).toFixed(2));
      setRigTransform(diaRef.current, 0, 0, -45 * (1 - pDia), 1.16 - 0.16 * easeOutExpo(pDiaRaw), 340, 340);

      // 3. 45-degree Monolith upward wipe + extrusion (0.18s - 0.70s)
      const pMono = easeOutExpo(prog(t, 0.18, 0.52));
      const sweepY = 640 - 540 * pMono;
      clipMonoPolyRef.current?.setAttribute(
        "points",
        `180,${(sweepY + 90).toFixed(1)} 500,${(sweepY - 90).toFixed(1)} 500,660 180,660`,
      );
      monoRef.current?.setAttribute("opacity", clamp01((t - 0.17) / 0.12).toFixed(2));
      setRigTransform(monoRef.current, 0, 24 * (1 - pMono), 0, 1, 340, 420);

      // 4. North Star flare & Y-axis Lancet strike (0.24s - 0.68s)
      const pStar = easeOutBack(prog(t, 0.24, 0.42));
      starRef.current?.setAttribute("opacity", clamp01((t - 0.23) / 0.12).toFixed(2));
      setRigTransform(
        starRef.current,
        0,
        0,
        -45 * (1 - easeOutExpo(prog(t, 0.24, 0.42))),
        Math.max(0.01, pStar),
        340.2,
        122,
      );
      const pStarGlint = prog(t, 0.26, 0.34);
      starGlintRef.current?.setAttribute(
        "opacity",
        (pStarGlint > 0 && pStarGlint < 1 ? Math.sin(pStarGlint * Math.PI) * 0.9 : 0).toFixed(2),
      );

      const pLancet = easeOutExpo(prog(t, 0.28, 0.42));
      lancetRef.current?.setAttribute("opacity", clamp01((t - 0.27) / 0.1).toFixed(2));
      setRigTransform(lancetRef.current, 0, -90 * (1 - pLancet), 0, 1, 340, 240);

      // 5. Smooth 3-Blade Gothic Wings radial unfold (0.38s - 0.96s)
      const pWing = easeOutExpo(prog(t, 0.38, 0.58));
      const wOp = clamp01((t - 0.37) / 0.15).toFixed(2);
      wingLRef.current?.setAttribute("opacity", wOp);
      wingRRef.current?.setAttribute("opacity", wOp);
      setRigTransform(wingLRef.current, 12 * (1 - pWing), 6 * (1 - pWing), 30 * (1 - pWing), 0.8 + 0.2 * pWing, 271, 455);
      setRigTransform(wingRRef.current, -12 * (1 - pWing), 6 * (1 - pWing), -30 * (1 - pWing), 0.8 + 0.2 * pWing, 409, 455);

      // 6. B-04 Victorian Volute center-out unfurl & Crimson shockwave (0.44s - 1.02s)
      const pVol = easeOutQuart(prog(t, 0.44, 0.56));
      const halfW = 165 * pVol;
      clipVolRectRef.current?.setAttribute("x", (340 - halfW).toFixed(1));
      clipVolRectRef.current?.setAttribute("width", (halfW * 2).toFixed(1));
      voluteRef.current?.setAttribute("opacity", clamp01((t - 0.43) / 0.12).toFixed(2));
      setRigTransform(voluteRef.current, 0, 12 * (1 - pVol), 0, 1, 340, 535);

      const pCrim = easeOutBack(prog(t, 0.54, 0.42));
      crimsonRef.current?.setAttribute("opacity", clamp01((t - 0.53) / 0.12).toFixed(2));
      setRigTransform(crimsonRef.current, 0, 0, 0, Math.max(0.01, pCrim), 340, 525);
      const pWave = prog(t, 0.56, 0.46);
      crimsonRingRef.current?.setAttribute(
        "opacity",
        (pWave > 0 && pWave < 1 ? (1 - pWave) * 0.72 : 0).toFixed(2),
      );
      setRigTransform(crimsonRingRef.current, 0, 0, 0, 0.55 + 1.1 * easeOutQuart(pWave), 340, 536);

      // 7. LEFICIØUS Wordmark stagger + 45-degree O Razor Slash Climax (0.54s - 1.32s)
      WORDMARK_LETTERS.forEach((_, idx) => {
        const gLet = wmLetterRefs.current[idx];
        if (!gLet) return;
        const t0 = 0.54 + idx * 0.032;
        const pLet = easeOutExpo(prog(t, t0, 0.38));
        gLet.setAttribute("opacity", clamp01((t - t0) / 0.16).toFixed(2));
        const extraTrack = (idx - 4) * 3.8 * (1 - pLet);
        gLet.setAttribute("transform", `translate(${extraTrack.toFixed(2)}, ${(7 * (1 - pLet)).toFixed(2)})`);
      });

      const pSlash = easeOutExpo(prog(t, 0.94, 0.28));
      oSlashRef.current?.setAttribute("stroke-dashoffset", (100 * (1 - pSlash)).toFixed(1));
      oSlashRef.current?.setAttribute("opacity", pSlash > 0.01 ? "1" : "0");

      const pSlashGlint = prog(t, 0.94, 0.36);
      oGlintRef.current?.setAttribute(
        "opacity",
        (pSlashGlint > 0 && pSlashGlint < 1 ? Math.sin(pSlashGlint * Math.PI) * 0.95 : 0).toFixed(2),
      );

      if (rawElapsed < totalDur) {
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    rafId = window.requestAnimationFrame(renderFrame);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const pal = getCrestPalette("gilt");

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="16 16 648 648"
        aria-hidden="true"
        className="h-[118px] w-[118px] overflow-visible drop-shadow-[0_10px_28px_rgba(212,173,115,0.2)] sm:h-[136px] sm:w-[136px]"
      >
        <defs>
          <clipPath id={clipMonoId}>
            <polygon ref={clipMonoPolyRef} points="180,100 500,100 500,660 180,660" />
          </clipPath>
          <clipPath id={clipVolId}>
            <rect ref={clipVolRectRef} x="175" y="460" width="330" height="160" />
          </clipPath>
        </defs>

        <g ref={astroRef} opacity="0">
          {ASTROLABE_GEOMETRY.arcs.map((arc, idx) => (
            <path
              key={idx}
              ref={(el) => {
                arcRefs.current[idx] = el;
              }}
              pathLength="100"
              d={arc.d}
              fill="none"
              stroke={pal.muted}
              strokeWidth={arc.tier === 1 ? 2.15 : arc.tier === 2 ? 1.55 : 1.15}
              opacity={arc.tier === 3 ? 0.78 : 0.94}
            />
          ))}
          {ASTROLABE_GEOMETRY.hooks.map((h, idx) => (
            <circle
              key={idx}
              cx={h.cx}
              cy={h.cy}
              r="4.3"
              fill="none"
              stroke={pal.muted}
              strokeWidth="1.35"
              opacity="0.85"
            />
          ))}
          <line x1="340" y1="20" x2="340" y2="49" stroke={pal.muted} strokeWidth="1.8" />
          <line x1="340" y1="631" x2="340" y2="660" stroke={pal.muted} strokeWidth="1.8" />
          <line x1="20" y1="340" x2="49" y2="340" stroke={pal.muted} strokeWidth="1.8" />
          <line x1="631" y1="340" x2="660" y2="340" stroke={pal.muted} strokeWidth="1.8" />
        </g>

        <g ref={diaRef} opacity="0">
          <polygon points="340,60 620,340 340,620 60,340" fill="none" stroke={pal.muted} strokeWidth="2.1" />
          <polygon
            points="340,72.5 607.5,340 340,607.5 72.5,340"
            fill="none"
            stroke={pal.muted}
            strokeWidth="1.35"
            opacity="0.82"
          />
          <path d="M 122 292 A 223 223 0 0 0 122 388 A 232 232 0 0 1 122 292 Z" fill={pal.muted} opacity="0.8" />
          <path d="M 558 292 A 223 223 0 0 1 558 388 A 232 232 0 0 0 558 292 Z" fill={pal.muted} opacity="0.8" />
        </g>

        <g ref={wingLRef} opacity="0">
          <path d={EMBLEM_PATHS.wingLeft} fill={pal.fg} fillRule="evenodd" />
        </g>
        <g ref={wingRRef} opacity="0">
          <path d={EMBLEM_PATHS.wingRight} fill={pal.fg} fillRule="evenodd" />
        </g>

        <g clipPath={`url(#${clipMonoId})`}>
          <g ref={monoRef} opacity="0">
            <path d={EMBLEM_PATHS.monolithLBase} fill={pal.fg} fillRule="evenodd" />
            <path d={EMBLEM_PATHS.spireLeftUpper} fill={pal.fg} fillRule="evenodd" />
            <path d={EMBLEM_PATHS.spireRightUpper} fill={pal.fg} fillRule="evenodd" />
            <path d={EMBLEM_PATHS.spireRightLowerA} fill={pal.fg} fillRule="evenodd" />
            <path d={EMBLEM_PATHS.spireRightLowerB} fill={pal.fg} fillRule="evenodd" />
          </g>
        </g>

        <g ref={lancetRef} opacity="0">
          <path d={EMBLEM_PATHS.lancetUpper} fill={pal.fg} fillRule="evenodd" />
        </g>
        <g ref={starRef} opacity="0">
          <path d={EMBLEM_PATHS.northStar} fill={pal.fg} fillRule="evenodd" />
        </g>
        <g ref={starGlintRef} opacity="0">
          <line x1="292" y1="122" x2="388" y2="122" stroke={pal.glint} strokeWidth="2.3" />
          <line x1="340.2" y1="74" x2="340.2" y2="170" stroke={pal.glint} strokeWidth="2.3" />
        </g>

        <g ref={crimsonRef} opacity="0">
          {EMBLEM_PATHS.crimsonCore.map((d, idx) => (
            <path key={idx} d={d} fill={pal.crimson} fillRule="evenodd" />
          ))}
        </g>
        <polygon
          ref={crimsonRingRef}
          points="340,492 384,536 340,580 296,536"
          fill="none"
          stroke={pal.crimson}
          strokeWidth="2.8"
          opacity="0"
        />

        <g clipPath={`url(#${clipVolId})`}>
          <g ref={voluteRef} opacity="0">
            <path d={EMBLEM_PATHS.voluteScroll} fill={pal.fg} fillRule="evenodd" />
          </g>
        </g>
      </svg>

      {/* Hairline Horizon Rule */}
      <div className="mt-3.5 flex items-center gap-2.5">
        <span className="atelier-curtain-rule-r h-px w-14 origin-right bg-gradient-to-l from-[#d4ad73]/80 to-transparent sm:w-20" />
        <span className="h-1.5 w-1.5 rotate-45 bg-[#a31b1e]" />
        <span className="atelier-curtain-rule-l h-px w-14 origin-left bg-gradient-to-r from-[#d4ad73]/80 to-transparent sm:w-20" />
      </div>

      {/* Choreographed LEFICIØUS Slashed Wordmark */}
      <svg
        viewBox="13 17 273 69"
        aria-hidden="true"
        className="mt-2.5 h-[26px] w-auto overflow-visible sm:h-[30px]"
      >
        {WORDMARK_LETTERS.map((item, idx) => (
          <g
            key={item.key}
            opacity="0"
            ref={(el) => {
              wmLetterRefs.current[idx] = el;
            }}
          >
            <path d={item.d} fill="#f5ebd6" fillRule="evenodd" />
          </g>
        ))}
        <line
          ref={oSlashRef}
          pathLength="100"
          x1={SLASH_LINE.x1}
          y1={SLASH_LINE.y1}
          x2={SLASH_LINE.x2}
          y2={SLASH_LINE.y2}
          stroke="#f5ebd6"
          strokeWidth="2.25"
          strokeLinecap="square"
          strokeDasharray="100"
          strokeDashoffset="100"
          opacity="0"
        />
        <line
          ref={oGlintRef}
          x1={SLASH_LINE.x1 + 4}
          y1={SLASH_LINE.y1 - 6}
          x2={SLASH_LINE.x2 - 4}
          y2={SLASH_LINE.y2 + 6}
          stroke="#fffef8"
          strokeWidth="3.6"
          opacity="0"
        />
      </svg>
    </div>
  );
}

/**
 * Scroll-triggered Colophon Seal & Wordmark lockup for the bottom of long-scroll
 * Case Studies, Gallery, and About Dossier pages (`useInViewOnce`).
 */
export function B04ColophonSeal({ subtitle }: { subtitle: string }) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>("40px 0px 20px 0px");

  return (
    <div
      ref={ref}
      className={`group inline-flex flex-wrap items-center gap-3.5 transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      <B04Crest
        interactive
        tone="gilt"
        detentStep={inView ? 1 : 0}
        className="h-11 w-11 drop-shadow-[0_4px_12px_rgba(0,0,0,0.75)]"
      />
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2.5">
          <LeficiousWordmark
            className="h-[19px] w-auto"
            color="#f3ead8"
            triggerKey={inView ? "colophon-visible" : "colophon-hidden"}
            ariaLabel="Leficious"
          />
          <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-[#a31b1e]" />
          <span className="font-numeral text-[12px] font-semibold tracking-[0.16em] text-warm uppercase">
            © {new Date().getFullYear()}
          </span>
        </div>
        <p className="font-display text-[15px] italic text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
