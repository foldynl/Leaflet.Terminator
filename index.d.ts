import * as L from "leaflet";

declare namespace terminator {
  /**
   * Calculate the present UTC Julian Date.
   * @param date - Date in milliseconds since Unix epoch
   * @returns Julian day number
   */
  function julian(date: number): number;

  /**
   * Calculate Greenwich Mean Sidereal Time.
   * @param julianDay - Julian day number
   * @returns GMST in hours (0-24)
   */
  function GMST(julianDay: number): number;

  /**
   * Options for configuring one terminator fill.
   */
  interface TerminatorOptions extends L.PathOptions {
    /**
     * Resolution for calculating terminator points (points per degree).
     * Higher values create smoother curves but use more computation.
     * @default 2
     */
    resolution?: number;

    /**
     * Longitude range in degrees for terminator calculation.
     * @default 720
     */
    longitudeRange?: number;

    /**
     * Time for which to calculate the terminator position.
     * If not provided, uses current time.
     */
    time?: Date | string | number;

    /**
     * Sun depression below the horizon in degrees.
     * Civil twilight is 6, nautical twilight is 12, astronomical twilight is 18.
     * @default 6
     */
    solarDepression?: number;

    /**
     * Stable name used by TwilightTerminator.getTerminator().
     */
    name?: string;
  }

  /**
   * Definition of one visible twilight terminator fill.
   */
  interface TerminatorDefinition extends TerminatorOptions {
    /**
     * Stable name used by TwilightTerminator.getTerminator().
     */
    name: string;

    /**
     * Sun depression below the horizon in degrees.
     */
    solarDepression: number;
  }

  /**
   * Options for configuring the default three-fill twilight overlay.
   */
  interface TwilightTerminatorOptions extends TerminatorOptions {
    /**
     * Terminator fill definitions. By default this contains civil, nautical,
     * and astronomical twilight at 6, 12, and 18 degrees below the horizon.
     */
    terminators?: TerminatorDefinition[];
  }

  /**
   * Sun's position in ecliptic coordinates.
   */
  interface SunEclipticPosition {
    /** Ecliptic longitude in degrees */
    lambda: number;
    /** Distance from Sun in AU */
    R: number;
  }

  /**
   * Sun's position in equatorial coordinates.
   */
  interface SunEquatorialPosition {
    /** Right ascension in degrees */
    alpha: number;
    /** Declination in degrees */
    delta: number;
  }

  /**
   * One filled area of constant Sun depression below the horizon.
   */
  class Terminator extends L.LayerGroup {
    /** Library version */
    readonly version: string;

    /** Configuration options */
    options: TerminatorOptions;

    /**
     * Create a new terminator fill instance.
     * @param options - Configuration options
     */
    constructor(options?: TerminatorOptions);

    /**
     * Update the terminator position for a specific time.
     * @param date - Date/time for which to calculate terminator position
     */
    setTime(date?: Date | string | number): this;

    /**
     * Apply a shared style to all polygon copies.
     * @param style - Leaflet path style options
     */
    setStyle(style: L.PathOptions): this;

    /**
     * Redraw all polygon copies.
     */
    redraw(): this;
  }

  /**
   * Layer group that displays civil, nautical, and astronomical terminator fills.
   */
  class TwilightTerminator extends L.LayerGroup {
    /** Configuration options */
    options: TwilightTerminatorOptions;

    /**
     * Create a new twilight terminator group.
     * @param options - Configuration options
     */
    constructor(options?: TwilightTerminatorOptions);

    /**
     * Update all terminator fills for a specific time.
     * @param date - Date/time for which to calculate terminator positions
     */
    setTime(date?: Date | string | number): this;

    /**
     * Apply a shared style to all terminator fills.
     * @param style - Leaflet path style options
     */
    setStyle(style: L.PathOptions): this;

    /**
     * Redraw all terminator fills. Provided for compatibility with Leaflet
     * path-like usage.
     */
    redraw(): this;

    /**
     * Return one named terminator fill, e.g. "civil", "nautical", or
     * "astronomical".
     * @param name - Terminator definition name
     */
    getTerminator(name: string): Terminator | undefined;
  }
}

/**
 * Factory function to create a twilight terminator overlay.
 * @param options - Configuration options
 * @returns New twilight terminator layer group
 */
declare function terminator(
  options?: terminator.TwilightTerminatorOptions
): terminator.TwilightTerminator;

export default terminator;
