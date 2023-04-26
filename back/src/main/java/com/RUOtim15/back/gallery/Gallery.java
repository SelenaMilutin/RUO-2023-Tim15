package com.RUOtim15.back.gallery;

import com.RUOtim15.back.appUser.AppUser;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Entity
public class Gallery {

    @Id
    protected Long id;

    private String name; // jedinstveno
    @ManyToOne  // galerija ima jednog vlasnika a on moze imati vise galerija
    private AppUser owner;
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name="gallery_user")
    private Collection<AppUser> viewers;

}
