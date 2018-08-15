/*


    This is the old dwm-bar.c version
    Please use the new one:
        https://github.com/wifiextender/dwm-bar










   dwm-bar.c - The `xsetroot' alternative in C to
       set the following information to the root window:
   CPU 10%, RAM 10%, SSD 10%, Linux release, Volume 10%, Time 10:00 PM

   Compile with:
       gcc -Wall -Wextra -O2 dwm-bar.c -o $HOME/.cache/dwm-bar -lasound -lX11

   Copyright 02/22/2015 Aaron Caffrey https://github.com/wifiextender

   This program is free software; you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation; either version 2 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program; if not, write to the Free Software
   Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
   MA 02110-1301, USA.
*/

#include <time.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <inttypes.h>

#include <sys/statvfs.h>
#include <sys/sysinfo.h>
#include <sys/utsname.h>

#include <X11/Xlib.h>
#include <alsa/asoundlib.h>

#define MB 1048576
#define GB 1073741824
#define VLA 100
#define COMMA ','
#define FMT "\x0a%s \x0b%s%%%c "
#define FMT_UINT "%"PRIuMAX
#define FILL_ARR(x,z) (sprintf(x, FMT_UINT, z))

static void get_cpu(char *);
static void get_ram(char *);
static void get_ssd(char *);
static void get_kernel(char *);
static void get_time(char *);
static void get_volume(char *);
static void set_status(const char *);


int main(void)
{
    char cpu[VLA], ram[VLA], ssd[VLA], kern[VLA];
    char volume[VLA], Time[VLA], combine[VLA*6];

    get_cpu(cpu);

    sleep(1);

    get_cpu(cpu);
    get_ram(ram);
    get_ssd(ssd);
    get_kernel(kern);
    get_volume(volume);
    get_time(Time);

    sprintf(combine,
        FMT FMT FMT "\x09%s%c " FMT "\x0a%s \x0b%s",
        "CPU", cpu, COMMA,
        "RAM", ram, COMMA,
        "SSD", ssd, COMMA,
        kern, COMMA,
        "Volume", volume, COMMA,
        "Time", Time);

    set_status(combine);

    return EXIT_SUCCESS;
}

static void get_cpu(char *str1)
{
    static uintmax_t previous_total = 0, previous_idle = 0;
    uintmax_t x, percent, diff_total, diff_idle, cpu_active[10];
    uintmax_t total = 0;

    memset(cpu_active, 0, sizeof(cpu_active));

    FILE *fstat = fopen("/proc/stat", "r");
    if (fstat == NULL)
        exit(EXIT_FAILURE);

    /* Some kernels will produce 7, 8 and 9 columns
     * We rely on 10, refer to `man proc' for more details */
    if (fscanf(fstat, "%*s " FMT_UINT FMT_UINT FMT_UINT FMT_UINT FMT_UINT FMT_UINT FMT_UINT FMT_UINT FMT_UINT FMT_UINT,
        &cpu_active[0], &cpu_active[1], &cpu_active[2], &cpu_active[3],
        &cpu_active[4], &cpu_active[5], &cpu_active[6], &cpu_active[7],
        &cpu_active[8], &cpu_active[9]) == EOF)
            exit(EXIT_FAILURE);

    fclose(fstat);

    for (x = 0; x < 10; x++)
        total += cpu_active[x];

    diff_total     = total - previous_total;
    diff_idle      = cpu_active[3] - previous_idle;

    previous_total = total;
    previous_idle  = cpu_active[3];

    percent        = (1000 * (diff_total - diff_idle) / diff_total + 5) / 10;

    FILL_ARR(str1, percent);
}

static void get_ram(char *str1)
{
    uintmax_t used = 0, total = 0, percent = 0;

    struct sysinfo mem;
    sysinfo(&mem);

    total   = (uintmax_t) mem.totalram / MB;
    used    = (uintmax_t) (mem.totalram - mem.freeram -
                     mem.bufferram - mem.sharedram) / MB;
    percent = (used * 100) / total;

    FILL_ARR(str1, percent);
}


static void get_ssd(char *str1)
{
    uintmax_t percent = 0;

    struct statvfs ssd;
    statvfs(getenv("HOME"), &ssd);

    percent = ((ssd.f_blocks - ssd.f_bfree) * ssd.f_bsize) / GB;

    FILL_ARR(str1, percent);
}


static void get_kernel(char *str1)
{
    struct utsname KerneL;
    uname(&KerneL);

    sprintf(str1, "%s %s", KerneL.sysname, KerneL.release);
}


static void get_time(char *str1)
{
    char time_str[VLA];

    time_t t = time(NULL);

    strftime(time_str, VLA, "%I:%M %p", localtime(&t));

    sprintf(str1, "%s", time_str);
}


static void get_volume(char *str1)
{
    snd_mixer_t *handle;
    snd_mixer_elem_t *elem;
    snd_mixer_selem_id_t *s_elem;

    snd_mixer_open(&handle, 0);
    snd_mixer_attach(handle, "default");
    snd_mixer_selem_register(handle, NULL, NULL);
    snd_mixer_load(handle);
    snd_mixer_selem_id_malloc(&s_elem);
    snd_mixer_selem_id_set_name(s_elem, "Master");

    elem = snd_mixer_find_selem(handle, s_elem);

    if (elem == NULL)
    {
        snd_mixer_selem_id_free(s_elem);
        snd_mixer_close(handle);

        exit(EXIT_FAILURE);
    }

    long int vol, max, min, percent;

    snd_mixer_handle_events(handle);
    snd_mixer_selem_get_playback_volume_range(elem, &min, &max);
    snd_mixer_selem_get_playback_volume(elem, 0, &vol);

    percent = (vol * 100) / max;

    snd_mixer_selem_id_free(s_elem);
    snd_mixer_close(handle);

    sprintf(str1, "%ld", percent);
}


static void set_status(const char *str1)
{
    Display *display = XOpenDisplay(NULL);

    if (display)
    {
        XStoreName(display, DefaultRootWindow(display), str1);
        XSync(display, 0);

        XCloseDisplay(display);
    }

    else
        exit(EXIT_FAILURE);
}
